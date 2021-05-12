import React from 'react';
import './App.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import * as style from 'react-syntax-highlighter/dist/esm/styles/hljs';
import jsbeautifier from 'js-beautify';

const getLangs = (obj: any) => obj["supportedLanguages"];
const supportedLanguages = getLangs(SyntaxHighlighter);

type Props = {}
type State = {
  counter: number,
  userInput: string,
  snippets: snipObj[],
  outStyle: string,
  outLang: string,
  lineNums: boolean,
  wrapLines: boolean
};

type snipObj = {
  txt: string,
  style: string,
  lang: string,
  lineNums: boolean,
  wrapLines: boolean
}

class App extends React.Component<Props, State> {
  state = {
    counter: 0,
    userInput: "",
    snippets: [],
    outStyle: "monokaiSublime",
    outLang: "javascript",
    lineNums: true,
    wrapLines: true
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

  addSnippet = (txt: string) => {
    let res = jsbeautifier(txt);
    this.setState({ snippets: [...this.state.snippets,
      {txt: res, style: this.state.outStyle, lang: this.state.outLang, lineNums: this.state.lineNums, wrapLines: this.state.wrapLines}
    ]});
  }

  render () {

    const styleNames: string[] = Object.keys(style);
    const styleOptions: JSX.Element[] = styleNames.map((el:string, i:number) => (
      <option key={i} value={el}>{el}</option>
    ))
    const langOptions: JSX.Element[] = supportedLanguages.map((el:string, i:number) => (
      <option key={i} value={el}>{el}</option>
    ))
    const readySnippets: JSX.Element[] = this.state.snippets.map((el, i:number) => (
      <li className="snippet" key={i}>
        <SyntaxHighlighter
          style={style[el['style']]}
          language={el['lang']}
          showLineNumbers={el['lineNums']}
          wrapLongLines={el['wrapLines']}
        >
          {el['txt']}
        </SyntaxHighlighter>
      </li>
    ));

    return (
      <div className="text-center App">

        <div className="container-fluid inner-wrapper-top bg-darker">

          <div className="container-fluid title-wrapper">
            <div className="title">Snippet Maker</div>
          </div>

          <div className="container-fluid p-2 workzone">
            <div className="row" style={{border:"1px solid red"}}>
              <div className="col-9 textarea-wrapper">
                <textarea className="input-area" onChange={this.handleOnChange} value={this.state.userInput}/>
              </div>
              <div className="col-3 options-wrapper">
                <div className="options-inner">
                <div className="options-line">
                  <select
                    value={this.state.outStyle}
                    onChange={(e:React.ChangeEvent<HTMLSelectElement>,):void => {
                      this.setState({ outStyle: e.currentTarget.value})
                    }}
                  >
                    {styleOptions}
                  </select>
                </div>

                <div className="options-line mt-2">
                  <select
                    value={this.state.outLang}
                    onChange={(e:React.ChangeEvent<HTMLSelectElement>,):void => {
                      this.setState({ outLang: e.currentTarget.value})
                    }}
                  >
                    {langOptions}
                  </select>
                </div>

                <div className="options-line mt-2">
                  <label>
                    <input
                      className="input-checkbox"
                      type="checkbox"
                      checked={this.state.lineNums}
                      onChange={() => this.setState({ lineNums: !this.state.lineNums })}>
                    </input>
                    Show line numbers
                  </label>
                </div>

                <div className="options-line mt-2">
                  <label>
                    <input
                      className="input-checkbox"
                      type="checkbox"
                      checked={this.state.wrapLines}
                      onChange={() => this.setState({ wrapLines: !this.state.wrapLines })}>
                    </input>
                    Wrap long lines
                  </label>
                </div>

                <div className="options-line py-2 mt-2">
                  <button
                    className="btn-submit"
                    test-id="btn-submit"
                    type="submit"
                    onClick={this.handleButtonClick}
                  >CREATE</button>
                </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="container-fluid my-2 inner-wrapper-middle bg-lighter">
          <div className="container-fluid title-wrapper">
            <div className="title">Ready Snippets:</div>
          </div>
          <div className="ready-snippets-wrapper">
            {readySnippets}
          </div>
        </div>

        <div className="container-fluid inner-wrapper-bottom bg-darker">@Copyright AP, 2021</div>

      </div>

    )
  }
}

export default App;