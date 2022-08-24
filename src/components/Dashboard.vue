<template>
  <div class="flexible-content">
    <SlideBar />
    <section id="dashboard">

      <mdb-card class="mb-4">

        <mdb-card-body class="d-sm-flex justify-content-between">
          <h4 class="mb-sm-0 pt-2">
            <a href="https://mdbootstrap.com/material-design-for-bootstrap/" target="_blank">Home
              Page</a><span>/</span><span>Dashboard</span>
          </h4>
          <form class="d-flex md-form justify-content-center" style="margin:0;">
            <input aria-label="Search" class="form-control" placeholder="Type your query" type="search" />
            <mdb-btn color="primary" size="sm" class="my-0" type="submit"><i class="fa fa-search"></i></mdb-btn>
          </form>
        </mdb-card-body>
      </mdb-card>
      <section class="mt-lg-5">

        <mdb-row>
          <mdb-col xl="3" md="6" class="mb-r">
            <mdb-card cascade class="cascading-admin-card">
              <div class="admin-up">
                <img src="https://icons.iconarchive.com/icons/froyoshark/enkel/256/Bitcoin-icon.png"
                  class="rounded-circle" style="width: 70px; height: 70px" alt="Palm Springs Road" />

                <div class="data">
                  <p>{{ btc.symbol }}</p>
                  <h4>
                    <strong>{{ btc.price }}</strong>
                  </h4>
                </div>
              </div>
              <mdb-card-body>
                <div class="progress">
                  <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" class="progress-bar bg-primary"
                    role="progressbar" style="width: 25%"></div>
                </div>
                <mdb-card-text>Better than last week (25%)</mdb-card-text>
              </mdb-card-body>
            </mdb-card>
          </mdb-col>
          <mdb-col xl="3" md="6" class="mb-r">
            <mdb-card cascade class="cascading-admin-card">
              <div class="admin-up">

                <img src="https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Ethereum-ETH-icon.png"
                  class="rounded-circle" style="width: 60px; height: 60px" alt="Palm Springs Road" />

                <div class="data">
                  <p>{{ eth.symbol }}</p>
                  <h4>
                    <strong>{{ eth.price }}</strong>
                  </h4>
                </div>
              </div>
              <mdb-card-body>
                <div class="progress">
                  <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" class="progress-bar bg grey darken-2"
                    role="progressbar" style="width: 25%"></div>
                </div>
                <mdb-card-text>Worse than last week (25%)</mdb-card-text>
              </mdb-card-body>
            </mdb-card>
          </mdb-col>
          <mdb-col xl="3" md="6" class="mb-r">
            <mdb-card cascade class="cascading-admin-card">
              <div class="admin-up">

                <img src="https://cdn-icons-png.flaticon.com/512/7439/7439929.png" class="rounded-circle"
                  style="width: 60px; height: 60px" alt="Palm Springs Road" />

                <div class="data">
                  <p>{{ doge.symbol }}</p>
                  <h4>
                    <strong>{{ doge.price }}</strong>
                  </h4>
                </div>
              </div>
              <mdb-card-body>
                <div class="progress">
                  <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="75" class="progress-bar grey darken-2"
                    role="progressbar" style="width: 75%"></div>
                </div>
                <mdb-card-text>Worse than last week (75%)</mdb-card-text>
              </mdb-card-body>
            </mdb-card>
          </mdb-col>
          <mdb-col xl="3" md="6" class="mb-r">
            <mdb-card cascade class="cascading-admin-card">
              <div class="admin-up">

                <img src="https://cdn-icons-png.flaticon.com/512/7016/7016538.png" class="rounded-circle"
                  style="width: 60px; height: 60px" alt="Palm Springs Road" />

                <div class="data">
                  <p>{{ shib.symbol }}</p>
                  <h4>
                    <strong>{{ shib.price }}</strong>
                  </h4>
                </div>
              </div>
              <mdb-card-body>
                <div class="progress">
                  <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" class="progress-bar bg-primary"
                    role="progressbar" style="width: 25%"></div>
                </div>
                <mdb-card-text>Better than last week (25%)</mdb-card-text>
              </mdb-card-body>
            </mdb-card>
          </mdb-col>
        </mdb-row>
      </section>
      

   
          <mdb-card class="mb-4">
            <mdb-card-header> 
             <strong style="font-size: large; text-align: center; "> BTC Chart </strong>   
              </mdb-card-header>
            <mdb-card-body>
              <div style=" height: 400px;">
                <mdb-line-chart style="height: 400px" :data="lineChartData" ref="btcChart" :options="lineChartOptions" :height="200"/>
              </div>
            </mdb-card-body>
          </mdb-card>
      </section>
  </div>
</template>



<script>
import { mdbRow, mdbCol, mdbBtn, mdbCard, mdbCardBody, mdbCardHeader, mdbCardText,  mdbLineChart } from 'mdbvue'
import SlideBar from './SlideBar.vue'
import io from 'socket.io-client'

export default {
  name: 'Dashboard',
  components: {
    mdbRow,
    SlideBar,
    mdbCol,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbLineChart
   
  },

  created() {
    this.getDataCrypto()
    
  },


  methods: {
    async getDataCrypto() {

      const socket = io("ws://localhost:3000", { transports: ['websocket'] });
      socket.emit("connection", "client connected")
      socket.on("data", (data) => {
        console.log(data)
        this.btc = data[0]
        this.eth = data[1],
        this.doge = data[2],
        this.shib = data[3]


        //set data line chart btc
        if(this.lineChartData.datasets[0].data.length > 19){
          this.lineChartData.datasets[0].data.shift()
        }

        this.lineChartData.datasets[0].data.push(parseInt(this.btc.price))

        this.$refs.btcChart.renderChart(this.lineChartData, null);

      })
    }

  },
 


  data() {
    return {

      btc: null,
      eth: null,
      doge: null,
      shib: null,
      showFrameModalTop: false,
      showFrameModalBottom: false,
      showSideModalTopRight: false,
      showSideModalTopLeft: false,
      showSideModalBottomRight: false,
      showSideModalBottomLeft: false,
      showCentralModalSmall: false,
      showCentralModalMedium: false,
      showCentralModalLarge: false,
      showCentralModalFluid: false,
      showFluidModalRight: false,
      showFluidModalLeft: false,
      showFluidModalTop: false,
      showFluidModalBottom: false,
      lineChartData: {
        labels: ['1', '2', '3', '4', '5', '6', '7','8','9','10','11','12','13','14','15','16','17','18','19','20'],
        datasets: 
          [{
            label: '#BTC',
            data: [],
            backgroundColor: 'rgb(176, 207, 197)',
          }]
      },
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }],
          yAxes: [{
            gridLines: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }]
        }
      },
      barChartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: '#1',
            data: [12, 39, 3, 50, 2, 32, 84],
            backgroundColor: 'rgba(245, 74, 85, 0.5)',
            borderWidth: 1
          }, {
            label: '#2',
            data: [56, 24, 5, 16, 45, 24, 8],
            backgroundColor: 'rgba(90, 173, 246, 0.5)',
            borderWidth: 1
          }, {
            label: '#3',
            data: [12, 25, 54, 3, 15, 44, 3],
            backgroundColor: 'rgba(245, 192, 50, 0.5)',
            borderWidth: 1
          }
        ]
      },
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            barPercentage: 1,
            gridLines: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }],
          yAxes: [{
            gridLines: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              beginAtZero: true
            }
          }]
        }
      },
      pieChartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            data: [300, 50, 100, 40, 120, 24, 52],
            backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#ac64ad'],
            hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774', '#da92db']
          }
        ]
      },
      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



.cascading-admin-card {
  margin: 20px 0;
}

.cascading-admin-card .admin-up {
  margin-left: 4%;
  margin-right: 4%;
  margin-top: -20px;
}

.cascading-admin-card .admin-up .fas,
.cascading-admin-card .admin-up .far {
  box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.2), 0 2px 13px 0 rgba(0, 0, 0, 0.19);
  padding: 1.7rem;
  font-size: 2rem;
  color: #fff;
  text-align: left;
  margin-right: 1rem;
  border-radius: 3px;
}

.cascading-admin-card .admin-up .data {
  float: right;
  margin-top: 2rem;
  text-align: right;
}

.admin-up .data p {
  color: #999999;
  font-size: 12px;
}

.classic-admin-card .card-body {
  color: #fff;
  margin-bottom: 0;
  padding: 0.9rem;
}

.classic-admin-card .card-body p {
  font-size: 13px;
  opacity: 0.7;
  margin-bottom: 0;
}

.classic-admin-card .card-body h4 {
  margin-top: 10px;
}
</style>
