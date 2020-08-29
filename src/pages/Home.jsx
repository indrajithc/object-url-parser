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
import useUrlParser from "../hooks/useUrlParser";

export default () => {
  const urlParser = useUrlParser();

  console.log(urlParser);
  return <h2>Home</h2>;
};
