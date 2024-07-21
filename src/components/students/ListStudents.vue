<template>
    <div>
        <div color="primary" class="mt-3">
            <ion-searchbar @ionChange="filterStudents()" v-model="search"></ion-searchbar>
        </div>
        <div v-if="students.length > 0">
            <show-student v-for="student in students" :key="student.idUser" :student-data="student">
            </show-student>
        </div>

        <div class="container" v-else>
            <div class="row justify-content-center align-items-center">
                <div class="col">
                    <img src="/assets/img/success.svg" class="img-fluid d-block mx-auto mt-5" style="width:50%;">


                    <p class="text-muted text-center">
                        Parece ser que no se encontraron estudiantes.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ShowStudent from './ShowStudent.vue'

export default {
    components: {
        ShowStudent
    },
    data: function () {
        return {
            apiToken: '',
            search: '',
            allStudents: [],
            students: []
        };
    },
    async created() {
        this.apiToken = await this.getApiToken();
        this.getAllStudents();
    },
    methods: {
        async getAllStudents() {
            const API_ENDOINT = this.getAPIEndpoint();
            const request = await fetch(API_ENDOINT + '/admin/getAllStudents', {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': 'Bearer ' + this.apiToken
                }
            });

            const data = await request.json();

            if (request.status === 200) {
                this.allStudents = data;
                this.students = data;
            } else {
                this.showErrorToast('Ups! Algo salió mal.');
            }
        },

        /** 
         * FIXME: 
         */
        filterStudents() {
            this.students = []
            const s = this.search.toLowerCase()
            this.students = this.allStudents.filter((item) => {
                
                try {
                    if (s == "") {
                        return true
                    }
                    
                    if(!isNaN(s)){
                        console.log("Carnet", s)
                        return item.correo.toLowerCase().includes(s)
                    }
                    else{
                        
                        if (s.toLowerCase().includes("@")) {
                            console.log(item)
                            return item.correo.toLowerCase().includes(s)
                            
                        }else{
                            console.log(item.nombres+" "+item.apellidos)
                            return (item.nombres+" "+item.apellidos).toLowerCase().includes(s)
                        }
                    }
                }
                catch (e) {
                    console.log("Error to find")
                }
            })
            console.log(this.students)
        },
        filterStudentsv2() {
            if (this.search !== '') {
                this.students = this.search
                    ? this.allStudents.filter((item) =>
                        item.nombres.toLowerCase().includes(this.search.toLowerCase()) ||
                        item.apellidos.toLowerCase().includes(this.search.toLowerCase()) ||
                        item.correo.toLowerCase().includes(this.search.toLowerCase()) ||
                        item.carrera.nombre.toLowerCase().includes(this.search.toLowerCase()) ||
                        item.carrera.facultad.nombre.toLowerCase().includes(this.search.toLowerCase())
                    )
                    : this.allStudents;
            } else {
                this.students = this.allStudents;
            }
        }
    },
}
</script>