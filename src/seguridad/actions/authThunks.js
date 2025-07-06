import { checkingCredentials, logout, login } from '../slices';

export const checkingAuthentication = () => {
    return async( dispatch ) => {

        dispatch( checkingCredentials() );
        
    }
}


export const startCreatingUserWithEmailPassword = ({ email, password, displayName }) => {
    return async( dispatch ) => {

        dispatch( checkingCredentials() );

        // TO DO
        const result = ""
        
        dispatch( login( result ))

    }

}


export const startLoginWithEmailPassword = ({ email, password }) => {
    return async( dispatch ) => {

        dispatch( checkingCredentials() );

        // TO DO
        const result = ""

        dispatch( login( result ));

    }
}


export const startLogout = () => {
    return async( dispatch ) => {
        
        // TO DO

        dispatch( logout() );

    }
}

