<template>
    <v-container fluid>
        <div>
            Schedule GraphQL Apollo
        </div>
        <v-layout row wrap align-center>

            <v-flex xs12>
                <v-autocomplete
                    v-model="station_details.transport_type_index"
                    :items="ratp"
                    label="Transport Type"
                    item-value="index"
                    item-text="title"
                    @change="getLines">
                    <template
                        slot="selection"
                        slot-scope="data">
                        <v-avatar>
                            <v-list-tile-avatar>
                                <img :src="data.item.picto">
                            </v-list-tile-avatar>
                        </v-avatar>
                        {{ data.item.title }}
                    </template>
                    <template
                        slot="item"
                        slot-scope="data">
                        <template>
                            <v-list-tile-avatar>
                                <img :src="data.item.picto">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title class="title font-weight-regular" v-html="data.item.title"></v-list-tile-title>
                            </v-list-tile-content>
                        </template>
                    </template>
                </v-autocomplete>
            </v-flex>

            <v-flex xs12>
                <v-autocomplete
                    v-model="station_details.line_index"
                    :items="ratp[station_details.transport_type_index].lines"
                    label="Lines"
                    item-value="index"
                    item-text="description"
                    single-line
                    @change="getStations">
                    <template
                        slot="selection"
                        slot-scope="data">
                        <v-avatar>
                            <v-list-tile-avatar>
                                <img :src="data.item.picto">
                            </v-list-tile-avatar>
                        </v-avatar>
                        {{ data.item.description }}
                    </template>
                    <template
                        slot="item"
                        slot-scope="data">
                        <template>
                            <v-list-tile-avatar>
                                <img :src="data.item.picto">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title class="title font-weight-regular" v-html="data.item.description"></v-list-tile-title>
                            </v-list-tile-content>
                        </template>
                    </template>

                </v-autocomplete>
            </v-flex>

            <v-flex xs12>
                <v-autocomplete
                    :disabled="!is_stations_loaded"
                    v-model="station_details.station_index"
                    :items="( station_details.line_index.length !== 0 && ratp[station_details.transport_type_index].lines.length > 0 ) ? ratp[station_details.transport_type_index].lines[station_details.line_index].stations : []"
                    label="Stations"
                    item-text="name"
                    item-value="index"
                    @change="getSchedules"
                    >
                </v-autocomplete>
            </v-flex>

            <v-flex xs10 align-center justify-center offset-xs1>
                <v-timeline v-if="station_details.schedules.length > 0">
                    <v-timeline-item
                        v-for="schedule in station_details.schedules"
                        :key="schedule.index"
                        color="red lighten-2"
                        small
                        :right="schedule.right"
                        :left="!schedule.right">
                        <span slot="opposite">{{ schedule.message }}</span>
                        <v-card class="elevation-2">
                            <v-card-text>
                                {{ schedule.destination }}
                            </v-card-text>
                        </v-card>
                    </v-timeline-item>
                </v-timeline>
            </v-flex>

        </v-layout>
    </v-container>
</template>
<script>
import gql from 'graphql-tag'
// import GetLinesByType from '../graphql/GetLinesByType.gql'

export default {
    data: () => ({
        ratp: [
            {
                index: 0,
                transport_type: 'rers',
                title: 'RER',
                picto: require('@/assets/picto_svg_ok/' + 'R' + '-flou0-160x160-bleu.svg'),
                lines: []
            },
            {
                index: 1,
                transport_type: 'metros',
                title: 'Métro',
                picto: require('@/assets/picto_svg_ok/' + 'M' + '-flou0-160x160-bleu.svg'),
                lines: []
            },
            {
                index: 2,
                transport_type: 'bus',
                title: 'Bus',
                picto: require('@/assets/picto_svg_ok/' + 'B' + '-flou0-160x160-bleu.svg'),
                lines: []
            },
            {
                index: 3,
                transport_type: 'tramways',
                title: 'Tramway',
                picto: require('@/assets/picto_svg_ok/' + 'T' + '-flou0-160x160-bleu.svg'),
                lines: []
            },
            {
                index: 4,
                transport_type: 'noctiliens',
                title: 'Noctilien',
                picto: require('@/assets/picto_svg_ok/' + 'N' + '-flou0-160x160-bleu.svg'),
                lines: []
            }
        ],
        
        station_details: {
            transport_type_index: 1,
            line_index: '',
            station_index: '',
            schedules: []
        },

        is_stations_loaded: false,
    }),
    // apollo: {
    //     lines: {
    //         query: gql`query ($transport_type: String!) {
    //             lines (transport_type_code: $transport_type) {
    //                 code
    //                 name
    //                 directions
    //                 id
    //             }
    //         }`,
    //         variables() {
    //             // this should be reactive
    //             // this is not reactive if data is nested deep
    //             return {
    //                 transport_type: this.ratp[this.station_details.transport_type_index].transport_type
    //             }
    //         }
    //     }
    //     // getLinesByType: GetLinesByType
    // },
    created() {
        this.getLines()
    },
    methods: {
        getLines() {
            this.station_details.line_index = ''
            this.station_details.station_index = ''
            this.is_stations_loaded = false
            this.station_details.schedules = []
            this.$apollo.query({
                query: gql`query ($transport_type: String!) {
                    lines (transport_type_code: $transport_type) {
                        code
                        name
                        directions
                        id
                    }
                }`,
                variables: {
                    transport_type: this.ratp[this.station_details.transport_type_index].transport_type
                },
            }).then((response) => {
                console.log(response)
                const lines_response = response.data.lines

                let lines = []

                // 去掉无法获取时间的线路
                switch (this.station_details.transport_type_index) {
                    case 0: // RER, only for A and B
                        lines = lines_response.slice(0, 2)
                        break
                    case 1: // Métro, only 1, ..., 14
                        lines = lines_response.slice(0, 16)
                        break
                    case 2: // Bus
                        lines = lines_response
                        break
                    case 3: // Tramway, 去掉无法获取时间的线路
                        lines = lines_response
                        lines.splice(5, 1) // 去掉T4
                        lines.splice(0, 1) // 去掉T11
                        break
                    case 4: // Noctilien
                        lines = lines_response
                }

                // 加入线路的图标
                for ( let i = 0; i < lines.length; i++ ) {
                    lines[i].index = i
                    lines[i].description = lines[i].name + ': ' + lines[i].directions
                    switch (this.station_details.transport_type_index) {
                        case 0: // RER
                            try {
                                lines[i].picto = require('@/assets/picto_svg_ok/' + 'RER' + lines[i].code + 'genRVB.svg')
                            } catch (error) {
                                lines[i].picto = require('@/assets/picto_svg_ok/' + 'R' + '-flou0-160x160-bleu.svg')
                            }
                            break
                        case 1:
                            try {
                                if ( lines[i].code.length === 1 ) {
                                    lines[i].picto = require('@/assets/picto_svg_ok/' + 'M' + lines[i].code + 'genRVB.svg')
                                } else if ( lines[i].code.length === 2 && !['3b', '7b'].includes(lines[i].code) ) {
                                    lines[i].picto = require('@/assets/picto_svg_ok/' + 'M' + lines[i].code + 'genRVB.svg')
                                } else if ( lines[i].code.length === 2 && ['3b', '7b'].includes(lines[i].code) ) {
                                    lines[i].picto = require('@/assets/picto_svg_ok/' + 'M' + lines[i].code + 'is' + 'genRVB.svg')
                                } else if ( lines[i].code === 'Fun' ) {
                                    lines[i].picto = require('@/assets/picto_svg_ok/' + 'funiculaireRVB.svg')
                                } else if ( lines[i].code === 'Orv' ) {
                                    lines[i].picto = require('@/assets/picto_svg_ok/' + 'OrlyvalRVB.svg')
                                }
                            } catch (error) {
                                lines[i].picto = require('@/assets/picto_svg_ok/' + 'M' + '-flou0-160x160-bleu.svg')
                            }
                            break
                        case 2: 
                            try {
                                lines[i].picto = require('@/assets/picto_svg_ok/' + lines[i].code + 'genRVB.svg')
                            } catch (error) {
                                lines[i].picto = require('@/assets/picto_svg_ok/' + 'B' + '-flou0-160x160-bleu.svg')
                            }
                            break
                        case 3:
                            try {
                                // 其他还没有出现的picto可以去网上下载
                                if ( ['3a', '3b'].includes(lines[i].code) ) {
                                    lines[i].picto = require('@/assets/picto_svg_ok/' + 'T' + lines[i].code + '-' + 'genRVB.svg')
                                } else {
                                    lines[i].picto = require('@/assets/picto_svg_ok/' + 'T' + lines[i].code + 'genRVB.svg')
                                }
                            } catch (error) {
                                lines[i].picto = require('@/assets/picto_svg_ok/' + 'T' + '-flou0-160x160-bleu.svg')
                            }
                            break
                        case 4:
                            try {
                                lines[i].picto = require('@/assets/picto_svg_ok/' + 'Noct-' + lines[i].code + '-' + 'genRVB.svg')
                            } catch (error) {
                                lines[i].picto = require('@/assets/picto_svg_ok/' + 'N' + '-flou0-160x160-bleu.svg')
                            }
                    }
                }

                this.ratp[this.station_details.transport_type_index].lines = lines

            }).catch((error) => {
                console.error(error)
            })
        },
        async getStations() {
            this.station_details.station_index = ''
            this.station_details.schedules = []
            if ( this.ratp[this.station_details.transport_type_index].lines[this.station_details.line_index].stations === undefined
                || this.ratp[this.station_details.transport_type_index].lines[this.station_details.line_index].stations.length === 0 ) {
                this.is_stations_loaded = false
                try {
                    const url = "https://api-ratp.pierre-grimaud.fr/v3/stations/" 
                        + this.ratp[this.station_details.transport_type_index].transport_type
                        + "/" + this.ratp[this.station_details.transport_type_index].lines[this.station_details.line_index].code
                    const response = await fetch(url)
                    const response_json = await response.json()
                    const stations = response_json.result.stations
                    for ( let i = 0; i < stations.length; i++ ) {
                        stations[i].index = i
                    }
                    this.ratp[this.station_details.transport_type_index].lines[this.station_details.line_index].stations = stations
                    this.is_stations_loaded = true
                }
                catch (err) {
                    console.log('fetch failed', err);
                }
            } else {
                this.is_stations_loaded = true
            }
        },
        async getSchedules() {
            try {
                const url = "https://api-ratp.pierre-grimaud.fr/v3/schedules/" 
                    + this.ratp[this.station_details.transport_type_index].transport_type
                    + "/" + this.ratp[this.station_details.transport_type_index].lines[this.station_details.line_index].code
                    + "/" + this.ratp[this.station_details.transport_type_index].lines[this.station_details.line_index].stations[this.station_details.station_index].slug
                    + "/A+R"
                const response = await fetch(url)
                const response_json = await response.json()
                const schedules = response_json.result.schedules 
                const first_destination = schedules[0].destination 
                for ( let i = 0; i < schedules.length; i++ ) {
                    schedules[i].right = schedules[i].destination === first_destination
                    schedules[i].index = i
                }
                this.station_details.schedules = schedules             
            }
            catch (err) {
                console.log('fetch failed', err);
            }
        }
    }
}
</script>