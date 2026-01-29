import { toastController } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';

const mixin = {
    methods: {
        getAPIEndpoint() {
            // return 'http://172.203.229.152/public/api';
            // return 'http://uca-css.test/css-proyecto/public/api'
            // return 'http://192.168.31.220/api'  

            //return 'http://127.0.0.1/api'
            // return 'https://uca.edu.sv/servicio-social/dev-proyectos/public/api'
            return 'https://uca.edu.sv/servicio-social/proyectos/public/api'
        },
        async setAuthenticatedUser(userData: any) {
            await Preferences.set({
                key: 'user',
                value: JSON.stringify(userData),
              });
        },
        async getAuthenticatedUser() {
            const { value: storedUser } = await Preferences.get({ key: 'user' });
            return storedUser ? JSON.parse(storedUser) : '';
        },
        async getApiToken() {
            const { value: storedUser } = await Preferences.get({ key: 'user' });
            const user = storedUser ? JSON.parse(storedUser) : '';
            return user ? user.api_token : '';
        },
        async getUserId() {
            const { value: storedUser } = await Preferences.get({ key: 'user' });
            const user = storedUser ? JSON.parse(storedUser) : '';
            return user ? user.idUser : '';
        },
        async getUserRolId() {
            const { value: storedUser } = await Preferences.get({ key: 'user' });
            const user = storedUser ? JSON.parse(storedUser) : '';
            return user ? user.idRol : '';
        },
        async signout() {
            await Preferences.remove({ key: 'user' });        
        },
        async showSuccessToast(message: string) {
            const toast = await toastController
                .create({
                    message: message,
                    duration: 2000,
                    color: 'dark'
                })
            return toast.present();
        },
        async showErrorToast(message: string) {
            const toast = await toastController
                .create({
                    message: message,
                    duration: 2000,
                    color: 'danger'
                })
            return toast.present();
        },
        async FormValidationFailed() {
            const toast = await toastController
            .create({
                message: '¡Ups! No se ha completado toda la información',
                duration: 2000,
                color: 'dark'
            })
            return toast.present();
        }
    }
}

export default mixin;