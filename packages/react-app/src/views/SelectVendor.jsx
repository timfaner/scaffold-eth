import { Button, notification, Badge, List } from "antd";
import React, { useState } from "react";
import QrReader from "react-qr-reader";
import { CameraOutlined, QrcodeOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

function SelectVendor({ provider, userSigner, updateBalanceBuidl, contractBuidl, vendors }) {
  const payUrl = "/pay?qr=ethereum%3Apay-0xf551954D449eA3Ae4D6A2656a42d9B9081B137b4%40280%2Ftransfer%3Faddress%3D";

  const history = useHistory();
  const [scan, setScan] = useState(false);

  return (
    <div>
      <h2>Purchase Food</h2>
      {scan ? (
        <div
          style={{
            zIndex: 256,
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
          }}
          onClick={() => {
            setScan(false);
          }}
        >
          <QrReader
            delay={250}
            resolution={1200}
            onError={e => {
              console.log("SCAN ERROR", e);
              setScan(false);
            }}
            onScan={newValue => {
              if (newValue) {
                console.log("SCAN VALUE", newValue);
                console.log("origin: ", window.location.origin);
                let url;
                if (newValue.startsWith("0x")) {
                  url = payUrl + newValue;
                } else if (newValue.startsWith(window.location.origin + "/pay")) {
                  url = newValue.split("/")[3];
                } else {
                  notification.error({
                    message: "Error Scanning QR code!",
                    description: "The QR code scanned is not valid.",
                    placement: "topRight",
                  });
                }
                console.log("url: ", url);
                if (url) {
                  history.push(url);
                }
                setScan(false);
              }
            }}
            style={{ width: "100%" }}
          />
        </div>
      ) : (
        <div
          style={{ marginTop: 4, cursor: "pointer" }}
          class="ant-btn ant-btn-primary"
          onClick={() => {
            setScan(!scan);
          }}
        >
          <Badge count={<CameraOutlined style={{ fontSize: 9 }} />}>
            <QrcodeOutlined style={{ fontSize: 18 }} />
          </Badge>{" "}
          Scan Food Truck QR Code
        </div>
      )}
      <List
        grid={{
          gutter: 2,
        }}
        dataSource={vendors}
        renderItem={vendor => {
          return (
            <List.Item style={{ margin: 20 }} key={vendor.value}>
              <Button
                style={{ width: 300, height: 300, fontSize: 32 }}
                onClick={() => {
                  history.push(payUrl + vendor.value);
                }}
              >
                {vendor.label}
              </Button>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default SelectVendor;