angular.module('ActiveStack.Config', [], function($provide) {
    $provide.factory('ActiveStackConfig', function($log) {
        return {
            gatewayIp:"127.0.0.1",
            gatewayPort: "8080",
            oauthProviders: {
                "ACTIVESTACK:BASIC":{name:"ACTIVESTACK:BASIC", redirectUri: "", appKey: "", authUrl: ""}
            }
        }
    });
});

