/** @jsx React.DOM */

var React = require('react/addons');
var Hintpoint = require('../Hintpoint/Hintpoint.jsx');

require('./Progress.css');

var Progress = React.createClass({
  
  getInitialState(){
    return {
      currentIssue: "",
      currentHoverIndex: "",
      expanded: {},
      clean: true
    }
  },

  _onSetHoverIssue(i, event){
    this.setState({
        currentHoverIndex: i.index
    });

  },

  _onSetFocusIssue(i, event){
    
    if(this.state.currentIssue.index === i.index){
      this.setState({
        currentIssue: "",
        clean: true
      });

    }else{
      this.setState({
        currentIssue: i,
        clean: false
      });
    }
    
  },
  
  render () {
    var { data, govReportLink } = this.props;
    var state = this.state;
    var classSet = React.addons.classSet;
  
    /*==================
           進度條
      ================== */
    var issueCount = 0;
  	var progressBricks = data.map((item,key)=>{
        var itemClasses = classSet({
          "Progress-item" : item.type === "challenge" ,
          "Progress-itemRow" : item.type === "row",
          "Progress-point" : item.type === "point",
          "is-first" : key === 0,
          "is-last" : key == data.length-1
        });

        var lableClasses = classSet({
          "Progress-label" : item.type === "challenge",
          "Progress-labelRow" : item.type === "row",
          "Progress-circle" : item.type === "point"
        })

        var issues = (item.issues) ? item.issues

        .map((i,k)=>{
            issueCount ++;
            var boundClick = this._onSetFocusIssue.bind(null,i);

            var boundHover = this._onSetHoverIssue.bind(null,i);
            
            var isFocused = (i.index === this.state.currentIssue.index);
            var issueClasses = classSet({
                  "Progress-issue" : item.type!=="row",
                  "Progress-issueRow" : item.type==="row",
                  "is-focused" : isFocused,
                  "is-hovered" : i.index === this.state.currentHoverIndex
                });
            var hintItem = (issueCount === 2 && state.clean) ? <Hintpoint /> : "";

            /* 訴求詳細版，mobile */

            //// 各修法版本 //
            var versionCount = 0;
            var proposedBillItem = (i.proposedBill) ? i.proposedBill.map((bill,bill_key)=>{
                
                if(bill.progress === item.stage)
                   versionCount = bill.bills.length;

                var versions = (bill.progress === item.stage) ? bill.bills.map((stage, stage_index)=>{
                    //var separater = (stage_index < bill.bills.length-1) ? "、":"";
                    var imgURL = require("./images/"+stage.proposer+".png");
                    
                    var summary = <div className="Progress-avatarHoverInfo">{stage.summary}</div>;
                    return (
                      <span key={stage_index}
                            className="Progress-versionItem">
                          <a className="Progress-link"
                             href={stage.link} 
                             target="_blank">
                             <img src={imgURL}
                                  className="Progress-avatarImg"/>
                             <div className="Progress-avatarName">{stage.proposer}</div>
                          </a>
                          {summary}
                      </span>    
                    )
                }) : "";
                
                return (
                    <span key={bill_key}>
                        {versions}
                    </span>
                 )
            }) : "";

            var showVersions = (isFocused) ? <div>{proposedBillItem}</div> : "";
            
            var fullItem = 
            (isFocused && item.type==="row") ? 
            <div className="Progress-issueFull">
                <div className="Progress-focusItem">
                    <div className="Progress-focusItemLeft">現行法律</div>
                    <div className="Progress-focusItemMain">{i.currentLaw}</div>
                </div>
                <div className="Progress-focusItem">
                    <div className="Progress-focusItemLeft">民團訴求</div>
                    <div className="Progress-focusItemMain">{i.titleFull}</div>
                </div>
                <div className="Progress-focusItem">
                    <div className="Progress-focusItemLeft">政府回應</div>
                    <div className="Progress-focusItemMain">{i.govState}</div>
                </div>
            </div> : "";
            
            var rowHint = (window.innerWidth > 600) ? "":i.title+" ：";
            var issueText = (item.type === "challenge") ? rowHint+versionCount +" 個版本" : i.index+" "+i.title;
            if(versionCount === 0  && item.type!=="row")
              issueClasses += " is-hide";

            var rowTitleClass = (item.type ==="row")? "Progress-issueMainTitle" : "";
            return (
              <a className={issueClasses}
                 key={k}
                 onClick={boundClick} 
                 onMouseOver={boundHover}>
                 {hintItem}
                 
                 <div className="Progress-issueMain">      
                    <div className={rowTitleClass}>{issueText}</div>  
                    {showVersions}
                    {fullItem}
                 </div>
                 
              </a>
            );
        }):"";

        //在委員會旁邊加上「實質審查」
        
        var debateContentItem = (item.stage==="委員會") ?
        <div>
          <div className="Progress-labelSidenote">實質審查</div>
          <div className="Progress-tri"></div>
        </div>
        : "";
        return (
           <div className={itemClasses}
                key={key}>
                <div className="Progress-unitPoint" />
                {debateContentItem}
                <div className={lableClasses}>
                  <div>{item.stage}</div>
                </div>
                <div className="Progress-issues">{issues}</div>
           </div>
        )
    });

    /*==================
           關注訴求
      ================== */

      //// 各修法版本 //
 
    var currentIssue = this.state.currentIssue;
   
    var proposedBillItem = (currentIssue) ? currentIssue.proposedBill.map((i,k)=>{
        //console.log(i);

        var versions = i.bills.map((stage, stage_index)=>{
          return (
            <li key={stage_index}>
                <a className="Progress-link"
                   href={stage.link} 
                   target="_blank">{stage.proposer}版</a>：{stage.summary}
                 
            </li>
          )

        })
        return (
            <div key={k}>
              <div>審議進度為「<b>{i.progress}</b>」之版本：</div>
              <ul>{versions}</ul>
            </div>
        )
        
    }) : "";
    // var currentIssueItem = (currentIssue) ? (
    //     <div className="Progress-focus"> 
    //         <div className="Progress-focusTitle">訴求 <br/> {currentIssue.title}</div>
    //         <div className="Progress-focusItem">
    //             <div className="Progress-focusItemLeft">民團訴求</div>
    //             <div className="Progress-focusItemMain">{currentIssue.titleFull}</div>
    //         </div>
    //         <div className="Progress-focusItem">
    //             <div className="Progress-focusItemLeft">現行法律</div>
    //             <div className="Progress-focusItemMain">{currentIssue.currentLaw}</div>
    //         </div>
    //         <div className="Progress-focusItem">
    //             <div className="Progress-focusItemLeft">修改草案</div>
    //             <div className="Progress-focusItemMain">
    //                {proposedBillItem}
    //             </div>
    //         </div>
            
    //         <div className="Progress-focusItem">
    //             <div className="Progress-focusItemLeft">政府回應</div>
    //             <div className="Progress-focusItemMain">{currentIssue.govState}</div>
    //         </div>
    //         <div className="Progress-note">「政府回應」係整理自立法院第8屆第7會期內政委員會第6次全體委員會議中，內政部、中選會之<a className="Progress-link" href={govReportLink} target="_blank">專題報告</a>內容。</div>
    //     </div>
    //   ) : "";

    
    
    return (
      
      <div className="Progress">
          
          <div className="Progress-bricks">
            {progressBricks}
          </div>
          
       
          
      </div>
          
    );
  }
});

module.exports = Progress;


