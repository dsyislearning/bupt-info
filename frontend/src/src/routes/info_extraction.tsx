import {
  Empty,
  Layout,
  Input,
  Flex,
  Button,
  Segmented,
  SegmentedProps,
  Tag,
} from "antd";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

const { Header, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: "left",
  // color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  // backgroundColor: "#4096ff",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  width: "100%",
  maxWidth: "100%",
  height: "100vh",
  lineHeight: "120px",
  // color: "#fff",
  // backgroundColor: "#0958d9",
};

const layoutStyle = {
  // borderRadius: 8,
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
  height: "100%vh",
  maxHeight: "100vh",
};

const contentFlexStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

function Extraction() {
  const [extracted, setExtracted] = useState<Boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [entitiesMap, setEntitiesMap] = useState<Record<string, string[]>>({});
  const [entityLabels, setEntityLabels] = useState<string[]>([]);
  const [showEntity, setShowEntity] = useState<string>("");

  const onExtract = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/extract`, {
        text: inputText,
      });
      console.log("onExtract: ", response.data);
      setEntitiesMap(response.data);
      setEntityLabels(Object.keys(response.data));
      setExtracted(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Link to="/">Back to Search</Link>
      </Header>
      <Content style={contentStyle}>
        <Flex style={contentFlexStyle} vertical>
          <h1>Information Extraction</h1>
          <Input.TextArea
            placeholder="input text"
            style={{ width: "600px" }}
            autoSize={{ minRows: 3, maxRows: 10 }}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div>
            <Button type="primary" onClick={onExtract}>
              Extract
            </Button>
          </div>
          {extracted &&
            (Object.keys(entitiesMap).length === 0 ? (
              <Flex style={contentFlexStyle} vertical>
                <h2>Entities</h2>
                <Segmented
                  options={entityLabels}
                  onChange={setShowEntity as SegmentedProps["onChange"]}
                />
                <div>
                  <Tag>{showEntity}</Tag>
                </div>
              </Flex>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ))}
        </Flex>
      </Content>
    </Layout>
  );
}

export default Extraction;
