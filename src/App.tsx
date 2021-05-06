import React from 'react';
import './App.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import jsbeautifier from 'js-beautify';

type Props = {}

type State = {
  counter: number,
  userInput: string,
  snippets: JSX.Element[]
};

class App extends React.Component<Props, State> {
  state = {
    counter: 0,
    userInput: "",
    snippets: []
  };

  handleOnChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    this.setState({ userInput: e.currentTarget.value })
  }

  handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if(this.state.userInput) {
      this.addSnippet(this.state.userInput)
      this.setState({userInput:""})
    }
  }

  addSnippet = (txt: string):void => {
    let res = jsbeautifier(txt);
    console.log(res);
    this.setState({
      snippets: [...this.state.snippets,
        <li className="snippet" key={this.state.counter}>
          <SyntaxHighlighter
            showLineNumbers
            language="javascript"
            style={monokaiSublime}
          >
            {res}
          </SyntaxHighlighter>
        </li>],
      counter: this.state.counter + 1
    })
  }

  render () {

    return (
      <div className="container-fluid text-center App">

        <div className="inner-wrapper container-fluid">
          <div className="container-fluid title-wrapper">
            <div className="title">TITLE</div>
          </div>

          <div className="creator-wrapper row">

            <div className="textarea-wrapper col-8">
              <textarea className="input-area" onChange={this.handleOnChange} value={this.state.userInput}/>
            </div>

            <div className="options-wrapper col-4">
              <div className="options-inner">
                <div className="dropdown-cont">choose lang</div>
                <div className="dropdown-cont">choose style</div>
                <div>add numbers/wrap long lines</div>
                <div className="button-cont">
                  <button
                  id="btn-submit"
                  test-id="btn-submit"
                  type="submit"
                  onClick={this.handleButtonClick}
                >CREATE</button>
                </div>
              </div>

            </div>

          </div>
        </div>

        <div className="snippets-wrapper container-fluid">
          <div className="inner-wrapper container-fluid">

            <div className="snipets-title container-fluid">snip title</div>
            <div className="list-wrapper">
              <ul className="snippet-list">
                {this.state.snippets}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-wrapper container-fluid text-center fixed-bottom">@Copyright AP, 2021</div>


      </div>
    )
  }
}

export default App;