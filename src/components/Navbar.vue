<template>
    <nav>
        <v-toolbar app>
            <v-toolbar-side-icon class="grey--text" @click="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title class="headline text-uppercase">
                <span>RATP </span>
                <span class="font-weight-light">Open API</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu offset-y>
                <v-btn
                    flat
                    slot="activator"
                    color="grey">
                    <v-icon left>fab fa-buromobelexperte</v-icon>
                    <span>Menu</span>
                </v-btn>
                <v-list>
                    <v-list-tile v-for="link in links" :key="link.text" :to="link.route">
                        <v-list-tile-title>{{ link.text }}</v-list-tile-title>

                    </v-list-tile>
                </v-list>
            </v-menu>
            <v-btn
                flat
                color="grey">
                <span>Sign out</span>
                <v-icon right>fas fa-sign-out-alt</v-icon>
            </v-btn>
        </v-toolbar>
        <v-navigation-drawer v-model="drawer" app dark class="indigo accent-3">
            <v-list>
                <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
                    <v-list-tile-action>
                        <v-icon :class="{'red--text': $route.path === link.route, 'white--text': $route.path !== link.route }">{{ link.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title :class="{'red--text': $route.path === link.route, 'white--text': $route.path !== link.route }">{{ link.text }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
    </nav>

</template>
<script>
    export default {
        data() {
            return {
                drawer: false,
                links: [
                    {
                        icon: 'fab fa-dev',
                        text: 'Schedule',
                        route: '/'
                    },
                    {
                        icon: 'fab fa-dev',
                        text: 'ScheduleGraphQLApollo',
                        route: '/scheduleApollo'
                    },
                    {
                        icon: 'fas fa-heart',
                        text: 'Go somewhere',
                        route: '/about'
                    },
                    {
                        icon: 'fas fa-location-arrow',
                        text: 'Favorites',
                        route: '/favorites'
                    },
                ],
                
            }
        },
        computed: {
            pathname: function () {
                return this.$route.path
            }
        }

    }
</script>