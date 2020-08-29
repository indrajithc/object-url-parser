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
import React from "react";
import UrlObjectViewer from "../common/UrlObjectViewer";

export default () => {
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
        <h2>About</h2>
        <UrlObjectViewer />
      </div>
    </div>
  );
};
