import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {getCookie} from './cookies'

export const AdminRoute = ({component: Components, ...rest}) => {

    console.log('🔐 AdminRoute renderizado')
    return (
        <Route {...rest} render={props => {
            const adminCookie = getCookie('admin');
            const statusCookie = getCookie('status');
            const isLoggedIn = statusCookie === 'logged';
            
            console.log('🔍 AdminRoute - Verificações:');
            console.log('   Admin cookie:', adminCookie, '(tipo:', typeof adminCookie, ')');
            console.log('   Status cookie:', statusCookie);
            console.log('   Está logado?', isLoggedIn);
            
            // Verificar se é admin (várias formas possíveis do cookie)
            const isAdmin = adminCookie === 'true' || adminCookie === true || adminCookie === 'True';
            console.log('   É admin?', isAdmin);
            
            if (isAdmin && isLoggedIn) {
                console.log('✅✅✅ ADMIN AUTORIZADO - Renderizando Painel de Controle');
                return <Components {...props} />;
            } else {
                console.log('❌❌❌ ACESSO NEGADO - Redirecionando...');
                if (!isLoggedIn) {
                    console.log('   Motivo: Não está logado');
                    return <Redirect to='/login'/>;
                }
                if (!isAdmin) {
                    console.log('   Motivo: Cookie admin não é "true" (valor:', adminCookie, ')');
                }
                return <Redirect to='/appointment'/>;
            }
        }}
      />
    )
}


