import React from "react";

export default class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: []
    };
  }

  componentDidMount() {
    axios.get('http://0.0.0.0:3000/api/Repos/status')
      .then(res => {
        const results = res.data;
        this.setState({ results });
      });
  }

  render() {
    return (
      <div>
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
                  {
                    this.state.results.map(result =>
                      <tr>
                        <td>{result.name}</td>
                        <td>{result.open_issues}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    )
                  }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
