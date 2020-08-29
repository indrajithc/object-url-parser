/*
 * Copyright(c) 2020 Mozanta Technologies Private Ltd.
 *
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of Mozanta ("Confidential
 * Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the contract agreement you entered into with Mozanta.
 *
 * @author Indrajith C
 */
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import useUrlParser from "../hooks/useUrlParser";

const UrlObjectViewer = () => {
  const urlParser = useUrlParser();

  const [parsedObject, setParsedObject] = useState({});

  const urlObject = urlParser && urlParser.object;

  useEffect(() => {
    if (
      urlObject &&
      typeof urlObject === "object" &&
      Object.keys(urlObject).length > 0
    ) {
      setParsedObject(urlObject);
    }
  }, [urlObject]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div style={{ margin: `2rem 0` }}>
        <h3>Decoded</h3>
        <ReactJson src={parsedObject} />
      </div>
    </div>
  );
};

export default UrlObjectViewer;
