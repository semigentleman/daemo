/**
 * UserController
 * @namespace crowdsource.worker.controllers
 */
(function () {
    'use strict';

    angular
        .module('crowdsource.user.controllers')
        .controller('UserController', UserController);

    UserController.$inject = ['$location', '$scope',
        '$window', '$mdToast', '$mdDialog', 'Authentication', 'User', 'Payment'];

    /**
     * @namespace UserController
     */
    function UserController($location, $scope,
                            $window, $mdToast, $mdDialog, Authentication, User, Payment) {

        var vm = this;
        vm.paypal_payment = paypal_payment;
        vm.toggleEdit = toggleEdit;
        vm.updateProfileDesc = updateProfileDesc;
        vm.edit = false;
        vm.genders = [
            {"key": "M", "value": "Male"},
            {"key": "F", "value": "Female"},
            {"key": "O", "value": "Other"}
        ];
        vm.ethnicities = [
            {"key":"white", "value":"White"},
            {"key":"hispanic", "value":"Hispanic"},
            {"key":"black", "value":"Black"},
            {"key":"islander", "value":"Native Hawaiian or Other Pacific Islander"},
            {"key":"indian", "value":"Indian"},
            {"key":"asian", "value":"Asian"},
            {"key":"native", "value":"Native American or Alaska Native"}
        ];
        vm.countries = User.getCountries();
        vm.cities = User.getCities();

        var userAccount = Authentication.getAuthenticatedAccount();
        if (!userAccount) {
            $location.path('/login');
            return;
        }

        User.getProfile(userAccount.username)
            .then(function (data) {
                var user = data[0];
                user.first_name = userAccount.first_name;
                user.last_name = userAccount.last_name;

                if (user.hasOwnProperty('financial_accounts') && user.financial_accounts) {
                    user.financial_accounts = _.filter(user.financial_accounts.map(function (account) {
                        var mapping = {
                            'general': 'general',
                            'requester': 'Deposits',
                            'worker': 'Earnings'
                        };

                        account.type = mapping[account.type];
                        return account;
                    }), function (account) {
                        return account.type != 'general';
                    });
                }

                vm.user = user;
                vm.user.birthday_obj = new Date(vm.user.birthday);
                updateUserDisplay();
                // Make worker id specific
                vm.user.workerId = user.id;
            });

        function toggleEdit() {
            vm.edit = !vm.edit;
        }

        function updateUserDisplay() {
            vm.user.birthday = vm.user.birthday_obj.yyyymmdd();
            vm.user.address.city_obj = getCityById(vm.user.address.city);
            vm.user.address.country_obj = getCountryById(vm.user.address.country);
        }

        function getCountryById(cid) {
            for (var index = 0; index < vm.countries.length; index++) {
                if (vm.countries[index].id === parseInt(cid)) {
                    return vm.countries[index];
                }
            }
        }

        function getCityById(cid) {
            for (var index = 0; index < vm.cities.length; index++) {
                if (vm.cities[index].id === parseInt(cid)) {
                    return vm.cities[index];
                }
            }
        }

        function updateProfileDesc() {
            updateUserDisplay();
            User.updateProfile(userAccount.username, vm.user)
                .then(function (data) {
                    if (data[1] === 200 && data[0].status === "updated profile") {
                        toggleEdit();
                    }
                });
        }

        function paypal_payment($event) {
            $mdDialog.show({
                clickOutsideToClose: false,
                preserveScope: false,
                targetEvent: $event,
                templateUrl: '/static/templates/payment/payment.html',
                locals: {
                    dialog: $mdDialog
                },
                controller: DialogController
            });

            function DialogController($scope, dialog) {

                $scope.payment_in_progress = false;

                $scope.payment_methods = [
                    {name: 'Paypal', method: 'paypal'},
                    {name: 'Credit Card', method: 'credit_card'}
                ];

                $scope.card_types = [
                    {name: 'Visa', type: 'visa'},
                    {name: 'MasterCard', type: 'mastercard'},
                    {name: 'Discover', type: 'discover'},
                    {name: 'American Express', type: 'american_express'}
                ];

                $scope.payment = {
                    amount: 1.00,
                    method: 'paypal',
                    type: 'self'
                };

                $scope.$watch('payment.method', function (newValue, oldValue) {
                    if (newValue != oldValue && newValue == 'paypal') {
                        if ($scope.payment.hasOwnProperty('credit_card')) {
                            delete $scope.payment.credit_card;
                        }
                    }
                });

                $scope.pay = function () {
                    $scope.payment_in_progress = true;

                    var data = angular.copy($scope.payment);

                    if (data.method == 'credit_card') {
                        data.credit_card.number = '' + data.credit_card.number;
                    }

                    Payment.create(data).then(
                        function success(response) {
                            if (data.method == 'credit_card') {
                                $mdToast.showSimple(response.message);
                                $location.url('/profile');
                            } else {
                                $window.location.href = response[0].redirect_url;
                            }
                        },
                        function error(response) {
                            $mdToast.showSimple('Error during payment. Please try again.');
                        }
                    ).finally(function () {
                            $scope.payment_in_progress = false;
                        });
                };

                $scope.hide = function () {
                    dialog.hide();
                };
                $scope.cancel = function () {
                    dialog.cancel();
                };


            }
        }
    }
})();