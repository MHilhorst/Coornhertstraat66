import React from "react";
import "./App.css";
import { Layout, List, Avatar, Tag, Spin } from "antd";

const { Header, Content, Footer } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.fetchItems = this.fetchItems.bind(this);
    this.handleProducts = this.handleProducts.bind(this);
    this.state = { loading: true, products: [] };
  }

  fetchItems = async () => {
    const response = await fetch("/.netlify/functions/index");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleProducts = async () => {
    const products = await this.fetchItems();
    return products.map((product) => {
      return {
        avatar: product.image,
        discount: product.discount,
        title: product.description,
        description: product.description,
        price: product.price,
      };
    });
  };
  async componentDidMount() {
    const products = await this.handleProducts();
    if (products) {
      this.setState({ loading: false, products: products });
    }
  }
  render() {
    return (
      <Layout className="layout">
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <div className="title">Coornhertstraat 66</div>
        </Header>
        <Content style={{ marginTop: 50 }}>
          <div className="site-layout-content">
            {this.state.loading && (
              <div className="center">
                <Spin size="large" />
              </div>
            )}
            {this.state.products.length > 0 && (
              <List
                itemLayout="horizontal"
                dataSource={this.state.products}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} size={75} />}
                      title={item.title}
                      description={
                        <>
                          {item.description}
                          <br />
                          <Tag
                            style={{ marginTop: 8 }}
                            color={item.price.was ? `#f40` : `#87d068`}
                          >
                            {item.price.now}
                          </Tag>
                          {item.price.was ? (
                            <Tag color="#87d068">{item.price.was}</Tag>
                          ) : null}
                          {item.discount ? (
                            <Tag style={{ marginTop: 8 }} color="#ff7900">
                              {item.discount.label}
                            </Tag>
                          ) : null}
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Coornhertstraat 66!!</Footer>
      </Layout>
    );
  }
}

export default App;
