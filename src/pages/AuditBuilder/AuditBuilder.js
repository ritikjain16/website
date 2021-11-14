import React from "react";
import RadioGroup from "antd/lib/radio/group";
import { Radio, Select } from "antd";
import { get } from "lodash";
import {
  fetchAuditQuestion,
  fetchAuditQuestionSections,
} from "../../actions/auditQuestion";
import {
  AuditBuilderContainer,
  AuditTypeFilterBox,
} from "./AuditBuilder.style";
import AuditBuilderTable from "./components/AuditBuilderTable";
import {
  auditType as auditTypeValues,
  auditQuestionType,
  auditSubTypes,
} from "../../constants/auditQuestionConst";
import {
  PUBLISHED_STATUS,
  UNPUBLISHED_STATUS,
} from "../../constants/questionBank";

const { preSales, mentor } = auditTypeValues;
const { bool, input, timestamp, rating, mcq } = auditQuestionType;

const auditQuestions = [bool, input, timestamp, rating, mcq];

const selectWidth = { width: 200 };

class AuditBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auditType: "",
      searchKey: "All",
      searchValue: "",
      totalScore: 0,
      auditSubType: "",
    };
  }

  componentDidMount = () => {
    const { match, history } = this.props;
    if (get(match, "params.auditType")) {
      let auditSubType = "";
      if (get(match, "params.auditType") === mentor) {
        auditSubType = auditSubTypes.b2cDemo;
      }
      this.setState({
        auditType: get(match, "params.auditType"),
        auditSubType,
      });
    } else {
      this.setState(
        {
          auditType: preSales,
        },
        () => history.push(`/ums/auditBuilder/${preSales}`)
      );
    }
  };

  fetchAuditData = async () => {
    const { searchKey, searchValue, auditType, auditSubType } = this.state;
    let filterQuery = "";
    if (auditType) {
      filterQuery += `{ auditType: ${auditType} }`;
    }
    if (searchKey === "Published Status") {
      filterQuery += `{ status: ${searchValue} }`;
    }
    if (searchKey === "Question Type") {
      filterQuery += `{ questionType: ${searchValue} }`;
    }
    if (searchKey === "Is Mandatory") {
      filterQuery += `{ isMandatory: ${searchValue} }`;
    }
    if (auditType === mentor && auditSubType) {
      filterQuery += `{ auditSubType: ${auditSubType} }`;
    }
    await fetchAuditQuestion(filterQuery);
  };
  componentDidUpdate(prevProps, prevState) {
    const { match } = this.props;
    if (get(match, "params") !== get(prevProps, "match.params")) {
      this.setState({
        auditType: get(match, "params.auditType"),
      });
    }
    if (prevState.auditType !== this.state.auditType && this.state.auditType) {
      this.fetchAuditData();
      fetchAuditQuestionSections(this.state.auditType);
    }
  }
  onStateChange = (event, shouldFetch = true) => {
    const { value, name } = event.target;
    let auditSubType = "";
    if (name === "auditType" && value === mentor) {
      auditSubType = auditSubTypes.b2cDemo;
    }
    this.setState(
      {
        [name]: value,
        auditSubType,
      },
      () => {
        if (name === "auditType") {
          this.props.history.push(`/ums/auditBuilder/${value}`);
        }
        if (shouldFetch) this.fetchAuditData();
      }
    );
  };
  onauditSubTypeChange = (value) => {
    const { auditSubType } = this.state;
    let newSubType = "";
    if (auditSubType !== value) {
      newSubType = value;
    }
    this.setState(
      {
        auditSubType: newSubType,
      },
      this.fetchAuditData
    );
  };
  getTotalScore = (totalScore) => {
    this.setState({
      totalScore,
    });
  };
  renderFilterInput = () => {
    const { searchKey, searchValue } = this.state;
    if (searchKey === "Published Status") {
      return (
        <RadioGroup
          value={searchValue}
          buttonStyle="solid"
          name="searchValue"
          onChange={this.onStateChange}
        >
          <Radio.Button value={PUBLISHED_STATUS}>Published</Radio.Button>
          <Radio.Button value={UNPUBLISHED_STATUS}>Unpublished</Radio.Button>
        </RadioGroup>
      );
    } else if (searchKey === "Question Type") {
      return (
        <Select
          value={searchValue}
          style={selectWidth}
          onChange={(value) =>
            this.onStateChange({
              target: { name: "searchValue", value },
            })
          }
        >
          {auditQuestions.map((type) => (
            <Select.Option value={type} key={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
      );
    } else if (searchKey === "Is Mandatory") {
      return (
        <RadioGroup
          value={searchValue}
          name="searchValue"
          buttonStyle="solid"
          onChange={this.onStateChange}
        >
          <Radio.Button value>Yes</Radio.Button>
          <Radio.Button value={false}>No</Radio.Button>
        </RadioGroup>
      );
    }
    return null;
  };
  render() {
    const { auditType, totalScore, searchKey, auditSubType } = this.state;
    return (
      <>
        <AuditBuilderContainer justify="space-between" padding="0">
          <div>
            <Select
              value={searchKey}
              style={{ ...selectWidth, marginRight: "15px" }}
              onChange={(value) =>
                this.onStateChange(
                  {
                    target: { name: "searchKey", value },
                  },
                  value === "All" && this.state.searchValue !== ""
                )
              }
            >
              {["All", "Published Status", "Question Type", "Is Mandatory"].map(
                (type) => (
                  <Select.Option value={type} key={type}>
                    {type}
                  </Select.Option>
                )
              )}
            </Select>
            {this.renderFilterInput()}
          </div>
          <AuditTypeFilterBox scoreBox>
            <h3 style={{ opacity: "1" }}>Total Score: {totalScore}</h3>
          </AuditTypeFilterBox>
        </AuditBuilderContainer>
        <AuditBuilderTable
          auditType={auditType}
          searchKey={searchKey}
          auditSubType={auditSubType}
          onStateChange={this.onStateChange}
          getTotalScore={this.getTotalScore}
          onauditSubTypeChange={this.onauditSubTypeChange}
          {...this.props}
        />
      </>
    );
  }
}

export default AuditBuilder;
