import React from "react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Splash from "../components/Splash";

export default class Layout extends React.Component {
  render() {
    return (
      <div class="container theme-showcase" role="main">
        <Navbar />
        <Splash />
        <div class="page-header">
          <h1>Sprint 1</h1>
        </div>
        <div class="row">
          <div class="col-md-12">
            <table class="table">
              <thead>
                <tr>
                  <th>Repos</th>
                  <th>Opened</th>
                  <th>Closed</th>
                  <th>Arrival</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Larry</td>
                  <td>the Bird</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
