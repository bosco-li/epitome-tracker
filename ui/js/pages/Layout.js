import React from "react";

import Content from "../components/Content";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Splash from "../components/Splash";

export default class Layout extends React.Component {
  render() {
    return (
      <div class="container theme-showcase" role="main">
        <Navbar />
        <Splash />
        <Content />
        <Footer />
      </div>
    );
  }
}
