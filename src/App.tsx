import React from 'react';
import './App.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import * as style from 'react-syntax-highlighter/dist/esm/styles/hljs';
import jsbeautifier from 'js-beautify';

const getLangs = (obj: any) => {
  return obj["supportedLanguages"];
}
const supportedLanguages = getLangs(SyntaxHighlighter);

type Props = {}

type State = {
  counter: number,
  userInput: string,
  snippets: snipObj[],
  outStyle: string,
  outLang: string
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
          wrapLines
        >
          {el['txt']}
        </SyntaxHighlighter>
      </li>
    ));

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

                <div>
                  <select
                    value={this.state.outStyle}
                    onChange={(e:React.ChangeEvent<HTMLSelectElement>,):void => {
                      this.setState({ outStyle: e.currentTarget.value})
                    }}
                  >
                    {styleOptions}
                  </select>
                </div>

                <div>
                  <select
                    value={this.state.outLang}
                    onChange={(e:React.ChangeEvent<HTMLSelectElement>,):void => {
                      this.setState({ outLang: e.currentTarget.value})
                    }}
                  >
                    {langOptions}
                  </select>
                </div>



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
                {readySnippets}
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