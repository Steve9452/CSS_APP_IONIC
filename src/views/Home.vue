<template>
<ion-page>
	<ion-header class="ion-no-border" translucent>
		<ion-toolbar class="py-1">
			<div style="width: 30vw;">
				<Logotype style="margin-top: 5px; margin-left: 20px;max-height:50px;text-align:center;" />
			</div>
			<ion-buttons slot="end">
				<ion-button @click="signMeOut()">
					<ion-icon color="primary" :icon="logOut"/>
				</ion-button>
			</ion-buttons>
		</ion-toolbar>
	</ion-header>

	<ion-content>
		<ion-tabs>
			<ion-router-outlet></ion-router-outlet>

			<ion-tab-bar class="py-2">
				<ion-tab-button tab="projects" href="/home/projects" v-if="userRol != ''">
					<ion-icon :icon="rocket" />
					<ion-label>Proyectos</ion-label>
				</ion-tab-button>

				<ion-tab-button tab="students" href="/home/students" v-if="userRol === 1">
					<ion-icon :icon="school"/>
					<ion-label>Estudiantes</ion-label>
				</ion-tab-button>

				<ion-tab-button tab="reminder" href="/home/reminder" v-if="userRol === 2">
					<ion-icon :icon="newspaper" />
					<ion-label>Recordatorio</ion-label>
				</ion-tab-button>

				<ion-tab-button tab="profile" href="/home/profile" v-if="userRol != ''">
					<ion-icon :icon="person" />
					<ion-label>Perfil</ion-label>
				</ion-tab-button>
			</ion-tab-bar>
		</ion-tabs>
	</ion-content>
</ion-page>
</template>

<script>
	import Logotype from '@/components/auth/helper/logotype.vue';
	import {
		ellipsisHorizontal,
		rocket,
		newspaper,
		person,
		school,
		logOut
	} from 'ionicons/icons';

	export default {
		name: 'Tabs',
		components: {
			Logotype
		},
		data() {
			return {
				userRol: '',
				ellipsisHorizontal,
				rocket,
				newspaper,
				person,
				school,
				logOut
			}
		},
		async created() {
			this.userRol = await this.getUserRolId();
		},
		methods: {
			async signMeOut(){
				await this.signout()
				location.reload()
			}
		}
	}
</script>