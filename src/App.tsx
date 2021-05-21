import React from 'react';
import './App.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import * as style from 'react-syntax-highlighter/dist/esm/styles/hljs';
import jsbeautifier from 'js-beautify';

const getLangs = (obj: any) => obj["supportedLanguages"];
const supportedLanguages = getLangs(SyntaxHighlighter);

type Props = {}
type State = {
  userInput: string,
  snippets: snipObj[],
  outStyle: string,
  outLang: string,
  lineNums: boolean,
  wrapLines: boolean,
  styleNames: string[],
  styleInd: any
};

type snipObj = {
  txt: string,
  style: undefined | string,
  lang: string,
  lineNums: boolean,
  wrapLines: boolean
}

enum snipObjKey {
  txt = "txt",
  lang = "lang",
  style = "style",
  lineNums = "lineNums",
  wrapLines = "wrapLines"
}

class App extends React.Component<Props, State> {
  state = {
    userInput: "",
    snippets: [],
    outStyle: "monokaiSublime",
    outLang: "javascript",
    lineNums: true,
    wrapLines: true,
    styleNames: Object.keys(style),
    styleInd: new Map()
  };

  componentDidMount () {
    const styleHash = new Map();
    for(let i = 0; i < this.state.styleNames.length; i++) {
      styleHash.set(this.state.styleNames[i], i);
    }
    this.setState({ styleInd: styleHash})
  }

  handleOnChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    this.setState({ userInput: e.currentTarget.value })
  }

  handleCreateButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if(this.state.userInput) {
      this.addSnippet(this.state.userInput);
      this.setState({userInput:""});
    }
  }

  addSnippet = (txt: string) => {
    const res = jsbeautifier(txt);
    this.setState({ snippets: [...this.state.snippets,
      {txt: res, style: this.state.outStyle, lang: this.state.outLang, lineNums: this.state.lineNums, wrapLines: this.state.wrapLines}
    ]});
  };

  switchStyle = (ind: number, dir: string): void => {

    const current: snipObj = this.state.snippets[ind];
    const currentStyle: string | undefined = current[snipObjKey.style];
    const currentStyleIndex: number = this.state.styleInd.get(currentStyle);

    const getStyle = (dir: string, index: number) => {
      if (index === 0 && dir === 'left') index = this.state.styleNames.length - 1;
      if (index === this.state.styleNames.length - 1 && dir === 'right') index = 0;
      if (dir === 'left') return this.state.styleNames[index - 1];
      if (dir === 'right') return this.state.styleNames[index + 1];
    }

    const newSnipArr: snipObj[] = this.state.snippets.slice();

    const newSnip: snipObj = {
      txt: current[snipObjKey.txt],
      lang: current[snipObjKey.lang],
      lineNums: current[snipObjKey.lineNums],
      wrapLines: current[snipObjKey.wrapLines],
      style: getStyle(dir, currentStyleIndex)
    }
    newSnipArr[ind] = newSnip;
    this.setState({ snippets: newSnipArr });
  }

  handleArrowButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const splitted: string[] = e.currentTarget.value.split(' ')
    this.switchStyle(parseInt(splitted[0]), splitted[1]);
  }

  render () {
    const styleOptions: JSX.Element[] = this.state.styleNames.map((el:string, i:number) => (
      <option key={i} value={el}>{el}</option>
    ))

    const langOptions: JSX.Element[] = supportedLanguages.map((el:string, i:number) => (
      <option key={i} value={el}>{el}</option>
    ))

    const readySnippets: JSX.Element[] = this.state.snippets.map((el, i:number) => (

      <div className="snippet-cont" key={i}>
        <div className="snippet-inner">
          <SyntaxHighlighter
          style={style[el['style']]}
          language={el['lang']}
          showLineNumbers={el['lineNums']}
          wrapLongLines={el['wrapLines']}
           >
            {el['txt']}
          </SyntaxHighlighter>
        </div>
        <div className="snippet-tools-cont">
          <button onClick={this.handleArrowButtonClick} value={`${i} left`}>Left</button>
          <button className="mt-2" onClick={this.handleArrowButtonClick} value={`${i} right`}>Right</button>
          <button className="mt-2">Down</button>
        </div>
      </div>

    ));

    return (
      <div className="text-center App">

        <div className="container-fluid inner-wrapper-top bg-darker">

          <div className="container-fluid title-wrapper">
            <div className="title">SnippetForge</div>
          </div>

          <div className="container-fluid p-2 workzone">
            <div className="row workzone-inner-wrapper">
              <div className="col-12 col-lg-9 textarea-wrapper">
                <textarea className="textarea-input" onChange={this.handleOnChange} value={this.state.userInput}/>
              </div>
              <div className="col-12 col-lg-3 options-wrapper">
                <div className="options-inner">
                  <div className="row">
                    <div className="col-6 options-line">
                      <select
                        value={this.state.outStyle}
                        onChange={(e:React.ChangeEvent<HTMLSelectElement>,):void => {
                          this.setState({ outStyle: e.currentTarget.value})
                        }}
                      >
                        {styleOptions}
                      </select>
                    </div>
                    <div className="col-6 options-line">
                      <select
                        value={this.state.outLang}
                        onChange={(e:React.ChangeEvent<HTMLSelectElement>,):void => {
                          this.setState({ outLang: e.currentTarget.value})
                        }}
                      >
                        {langOptions}
                      </select>
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className={this.state.lineNums ? "label-bright" : "label-bright pale"}>
                      <input
                        className="input-checkbox"
                        type="checkbox"
                        checked={this.state.lineNums}
                        onChange={() => this.setState({ lineNums: !this.state.lineNums })}>
                      </input>
                      Show line numbers
                    </label>
                  </div>

                  <div className="mt-2">
                    <label className={this.state.wrapLines ? "label-bright" : "label-bright pale"}>
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
                      onClick={this.handleCreateButtonClick}
                    >CREATE</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="container-fluid my-2 inner-wrapper-middle bg-lighter">
          <div className="container-fluid title-wrapper">
            <h3>Your snippets:</h3>
          </div>
          <div className="ready-snippets-wrapper">
            <div>
              {readySnippets}
            </div>
          </div>
        </div>

        <div className="container-fluid inner-wrapper-bottom bg-darker">
          <span className="footer-span">Copyright © 2021 Andrey Petunin. All Rights Reserved.</span>
        </div>

      </div>
    )
  }
}

export default App;