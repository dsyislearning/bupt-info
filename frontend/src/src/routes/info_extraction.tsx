import {
  Card,
  Empty,
  Layout,
  Input,
  Flex,
  Button,
  Rate,
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
  height: "100%",
  maxHeight: "100%",
};

function Extraction() {
  const [extracted, setExtracted] = useState<Boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [entitiesMap, setEntitiesMap] = useState<Record<string, string[]>>({});
  const [entityLabels, setEntityLabels] = useState<string[]>([]);
  const [showEntity, setShowEntity] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onExtract = async () => {
    setIsLoading(true);
    try {
      if (inputText === "") {
        setEntitiesMap({});
        setEntityLabels([]);
        setExtracted(false);
        setIsLoading(false);
        return;
      }
      const response = await axios.post(`http://localhost:5000/extract`, {
        text: inputText,
      });
      console.log("onExtract: ", response.data);
      setEntitiesMap(response.data);
      setEntityLabels(Object.keys(response.data));
      setShowEntity(Object.keys(response.data)[0]);
      setExtracted(true);
      setIsLoading(false);
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
        <Flex style={{ textAlign: "center", alignItems: "center" }} vertical>
          <h1>Information Extraction</h1>
          <Input.TextArea
            placeholder="input text"
            style={{ width: "600px" }}
            autoSize={{ minRows: 3, maxRows: 10 }}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div>
            <Button type="primary" onClick={onExtract} loading={isLoading}>
              Extract
            </Button>
          </div>
          {extracted &&
            (Object.keys(entitiesMap).length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Flex vertical>
                <h2>Entities</h2>
                <Rate></Rate>
                <Segmented
                  options={entityLabels}
                  onChange={setShowEntity as SegmentedProps["onChange"]}
                />
                <Card>
                  {entitiesMap[showEntity].map((entity, index) => (
                    <Tag key={index}>{entity.toString()}</Tag>
                  ))}
                </Card>
              </Flex>
            ))}
        </Flex>
      </Content>
    </Layout>
  );
}

export default Extraction;
