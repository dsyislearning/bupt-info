import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import axios from "axios";

import { Input, Space, List, Button, Card, Rate, Tag, Typography } from "antd";
import type { SearchProps } from "antd/es/input";

const { Search } = Input;

interface Passage {
  title: string;
  summary: string;
  context: string[];
  score: number;
}

function App() {
  const [list, setList] = useState<Passage[]>([]);
  const [num_passages, setNumPassages] = useState<number>(0);
  const [showContext, setShowContext] = useState<{ [index: number]: boolean }>(
    {}
  );
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const onSearch: SearchProps["onSearch"] = async (value, _e, info) => {
    console.log(info?.source, value);
    setHasSearched(true);

    try {
      const response = await axios.post(`http://localhost:5000/search`, {
        query: value,
      });
      setList(response.data);
      setNumPassages(response.data.length);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Space
          direction="vertical"
          style={{ maxWidth: "600px", marginBottom: "20px" }}
        >
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            enterButton
          />
          {hasSearched && (
            <List
              style={{ backgroundColor: "white", alignItems: "flex-start"}}
              pagination={{ position: "bottom", align: "center" }}
              header={<div>{num_passages} passages found</div>}
              // footer={<div>Footer</div>}
              bordered
              dataSource={list}
              renderItem={(item, index) => (
                <Card
                  style={{textAlign: "left", width: "100%"}}
                  title={
                    <Typography.Title level={4} style={{ textAlign: "left" }}>
                      {item.title}
                    </Typography.Title>
                  }
                  extra={
                    <Space>
                      <Button
                        type="primary"
                        onClick={() =>
                          setShowContext((pre) => ({
                            ...pre,
                            [index]: !pre[index],
                          }))
                        }
                      >
                        {showContext[index] ? "Hide Context" : "Show Context"}
                      </Button>
                    </Space>
                  }
                >
                  <Space
                    direction="vertical"
                    style={{ alignItems: "flex-start" }}
                  >
                    <Space style={{alignItems: "flex-start"}}>
                      <Tag
                        style={{ textAlign: "center", alignContent: "left" }}
                      >
                        Score: {item.score}
                      </Tag>
                      <Rate allowClear={true} onChange={(rate: number) => {
                        console.log("rate", rate, "for doc", index);

                        axios.post(`http://localhost:5000/rate`, {
                          doc_id: index,
                          rating: rate
                        })
                      }}/>
                    </Space>

                    {!showContext[index] && (
                      <Typography.Paragraph style={{ textAlign: "left" }}>
                        {item.summary}
                      </Typography.Paragraph>
                    )}

                    {showContext[index] &&
                      item.context.map((paragraph, paragraph_id) => (
                        <Typography.Paragraph style={{ textAlign: "left" }}>
                          {paragraph}
                        </Typography.Paragraph>
                      ))}
                  </Space>
                </Card>
              )}
            />
          )}
        </Space>

        {!hasSearched && (
          <p>
            Enter some text in the search box and press Search button to search.
          </p>
        )}
      </header>
    </div>
  );
}

export default App;
