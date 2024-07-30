import React from "react";
import { Button, Checkbox, Form, Input } from "antd";

const onFinish = (values) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white ">
      <main className="flex flex-col lg:flex-row items-center justify-center flex-1 w-full p-4 lg:p-10 max-w-screen-xl h-screen">
        <div className="lg:w-1/2 px-4 lg:px-6 flex flex-col justify-center items-center overflow-hidden">
          <header className="flex flex-col items-center w-full p-4">
            <span className="text-xl font-bold text-blue-600">
              <img className="w-32" src="/assets/sayl.png" alt="" />
            </span>
            <h4 className="text-blue-600 border-blue-600 border px-4 py-2 rounded-md mt-4 text-center">
              Welcome Back! <br /> Please login to your account.
            </h4>
          </header>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="mt-8"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="flex justify-between items-center">
                <Checkbox>Remember me</Checkbox>
                <button className="text-blue-600 hover:underline focus:outline-none">
                  Reset Password
                </button>
              </div>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button className="w-full" type="primary" htmlType="submit">
                LOGIN
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="hidden lg:block lg:w-1/2 px-4 lg:px-6 mt-10 lg:mt-0">
          <img
            src={`${process.env.PUBLIC_URL}/assets/HandsGraduate.svg`}
            alt="People with questions"
            className="max-w-full h-auto"
          />
        </div>
      </main>
    </div>
  );
}
