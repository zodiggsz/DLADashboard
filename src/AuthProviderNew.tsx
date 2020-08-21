import * as React from 'react';
import { UserAgentApplication } from 'msal';
import { config } from './config';
import { getUserDetails } from './webparts/dlaDashboard/services/GraphServices';

export interface AuthComponentProps {
  error: any;
  isAuthenticated: boolean;
  user: any;
  login: Function;
  logout: Function;
  getAccessToken: Function;
}

interface AuthProviderState {
  error: any;
  isAuthenticated: boolean;
  user: any;
}

export default function withAuthProvider<T extends React.Component<AuthComponentProps>>
  (WrappedComponent: new(props: AuthComponentProps, context?: any) => T) {

    const [accessToken, setAccessToken] = React.useState<string>();
    const [error, setError] = React.useState<boolean>();
    const [isAuthenticated, setAuthentication] = React.useState<boolean>();
    const [user, setUser] = React.useState({});
    const userAgent = new UserAgentApplication({
        auth: {
            clientId: config.appId,
            redirectUri: config.redirectUri
        },
        cache: {
            cacheLocation: "sessionStorage",
            storeAuthStateInCookie: true
        }
    });

    React.useEffect(() => { 
        
        const account = userAgent.getAccount();
        if(account){
            setUser({ account }) 
        }
        
        return; 
    }, []);

    userAgent.handleRedirectCallback((error, result) => {
        // msal requires a redirect callback, even though can't use it to
        // get the result as it will redirect again after it has the result
        // and not provide the result of the call back on the second
        // redirect.
    });

    async function getUserProfile() {
        console.log('user');
        try {
            var accessToken = await getAccessToken(config.scopes);

            if (accessToken) {
                // Get the user's profile from Graph
                var user = await getUserDetails(accessToken);
                setAuthentication(true);
                setUser({
                    displayName: user.displayName,
                    email: user.mail || user.userPrincipalName,
                })
                setError(false);
            }
        }
        catch(err) {
            setAuthentication(true);
            setUser({})
            setError(normalizeError(err));
        }
    }

    async function login() {
        try {
            userAgent.handleRedirectCallback(getUserProfile);
            // Login via popup
            await userAgent.loginRedirect(
                {
                scopes: config.scopes,
                prompt: "select_account"
            });
            // After login, get the user's profile

        }
        catch(err) {
            setAuthentication(true);
            setUser({})
            setError(normalizeError(err));
        }
    }

    function logout() {
        userAgent.logout();
    }

    async function getAccessToken(scopes: string[]): Promise<string> {

        try {
            // Get the access token silently
            // If the cache contains a non-expired token, this function
            // will just return the cached token. Otherwise, it will
            // make a request to the Azure OAuth endpoint to get a token
            var silentResult = await userAgent.acquireTokenSilent({
            scopes: scopes
            });

            return silentResult.accessToken;
        } catch (err) {
            // If a silent request fails, it may be because the user needs
            // to login or grant consent to one or more of the requested scopes
            if (isInteractionRequired(err)) {
                const userScope = {
                    scopes: scopes
                };
                userAgent.acquireTokenRedirect(userScope);
            } else {
            throw err;
            }
        }
    }

    function normalizeError(error: string | Error): any {
        var normalizedError = {};
        if (typeof(error) === 'string') {
            var errParts = error.split('|');
            normalizedError = errParts.length > 1 ?
            { message: errParts[1], debug: errParts[0] } :
            { message: error };
        } else {
            normalizedError = {
            message: error.message,
            debug: JSON.stringify(error)
            };
        }
        return normalizedError;
    }

    function isInteractionRequired(error: Error): boolean {
        if (!error.message || error.message.length <= 0) {
            return false;
        }

        return (
            error.message.indexOf('consent_required') > -1 ||
            error.message.indexOf('interaction_required') > -1 ||
            error.message.indexOf('login_required') > -1
        );
    }
    
    return (
        <WrappedComponent
            error = { error }
            isAuthenticated = { isAuthenticated }
            user = { user }
            login = { () => login() }
            logout = { () => logout() }
            getAccessToken = { (scopes: string[]) => getAccessToken(scopes)}
            />
    )
        
};
