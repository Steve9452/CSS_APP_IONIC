<template>
<ion-app>
	<ion-router-outlet />
</ion-app>
</template>
<script>
import { Storage } from '@capacitor/storage';

export default {
	async created() {
		const {value} = await Storage.get({key: "FAILURED_NOTIFICATION"})

		console.log("LAST NOTIFICATION CODE", value);
	}
}


</script>