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

      <div>
        <div id="top">
        <form>
          <label htmlFor="userInput">Type/Paste your code here:</label><br/>
          <textarea id="input-area" onChange={this.handleOnChange} value={this.state.userInput}/><br/>
          <button id="btn-submit" test-id="btn-submit" type="submit" onClick={this.handleButtonClick}>CREATE</button>
        </form>
        </div>

        <div id="bottom">
          <ul id="list"/>
        </div>
        <div>
          {this.state.snippets}
        </div>
      </div>

    )
  }
}

export default App;