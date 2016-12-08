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
          <h1>Current Sprint Summary</h1>
        </div>
        <div class="row">
          <div class="col-md-12">
            <table class="table">
              <thead>
                <tr>
                  <th>Repos</th>
                  <th>Opened Issues</th>
                  <th>Closed Issues</th>
                  <th>New Issues</th>
                  <th>New PRs</th>
                </tr>
              </thead>
              <tbody>
                  {
                    this.state.results.map(result =>
                      <tr>
                        <td>{result.name}</td>
                        <td>{result.open_issues}</td>
                        <td>{result.closed_issues}</td>
                        <td>{result.new_issues}</td>
                        <td>{result.new_prs}</td>
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
