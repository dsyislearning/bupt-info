import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import axios from "axios";

import { Input, Space, List, Typography } from "antd";
import type { SearchProps } from "antd/es/input";

const { Search } = Input;

function App() {
  const [list, setList] = useState<string[]>([]);
  const [num_passages, setNumPassages] = useState<number>(0);
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
              style={{ backgroundColor: "white" }}
              pagination={{ position: "bottom", align: "center" }}
              header={<div>{num_passages} passages found</div>}
              // footer={<div>Footer</div>}
              bordered
              dataSource={list}
              renderItem={(item, index) => (
                <List.Item>
                  <Typography.Text mark>[ITEM {index}]</Typography.Text> {item}
                </List.Item>
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
