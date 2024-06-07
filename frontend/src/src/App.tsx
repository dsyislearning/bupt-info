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
  const [ratings, setRatings] = useState<number[]>([]);

  const onSearch: SearchProps["onSearch"] = async (value, _e, info) => {
    console.log(info?.source, value);
    setHasSearched(true);

    try {
      const response = await axios.post(`http://localhost:5000/search`, {
        query: value,
      });
      setList(response.data);
      setNumPassages(response.data.length);

      console.log("onSearch: ", response.data);

      setRatings(new Array(response.data.length).fill(0));
    } catch (error) {
      console.error(error);
    }
  };

  const onRate = async (index: number, rating: number) => {
    try {
      const response = await axios.post(`http://localhost:5000/rate`, {
        index: index,
        rating: rating,
      });
      console.log("onRate: ", response.data);
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
              style={{ backgroundColor: "white", alignItems: "flex-start" }}
              pagination={{ position: "bottom", align: "center" }}
              header={<div>{num_passages} passages found</div>}
              // footer={<div>Footer</div>}
              bordered
              dataSource={list}
              renderItem={(item, index) => (
                <Card
                  style={{ textAlign: "left", width: "100%" }}
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
                    <Space style={{ alignItems: "flex-start" }}>
                      <Tag
                        style={{ textAlign: "center", alignContent: "left" }}
                      >
                        BM25 Score: {item.score}
                      </Tag>
                      <Rate
                        value={ratings[index]}
                        allowClear={true}
                        onChange={(rating: number) => {
                          console.log("rate", rating, "for doc", index);
                          onRate(index, rating);
                          const newRatings = [...ratings];
                          newRatings[index] = rating;
                          setRatings(newRatings);
                        }}
                      />
                    </Space>

                    {!showContext[index] && (
                      <Typography.Paragraph style={{ textAlign: "left" }}>
                        {item.summary}
                      </Typography.Paragraph>
                    )}

                    {showContext[index] &&
                      item.context.map((paragraph) => (
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
