import React, { useEffect, useRef, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import ButtonField from '@/components/Field/ButtonField';
import axios from '@/libs/axios';

const SendRequest = () => {
    const formRef = useRef();

    const defaultParams = {
        id: '',
        request_type: '',
        type: '',
        sub_type: '',
        description: '',
    };
    const [params, setParams] = useState(defaultParams);
    const [Type, setType] = useState({ name: '', data: [] });

    const handleType = (type) => {
        try {
            if (type === 'asset') {
                setType({ ...Type, name: 'Assets' });
            } else if (type === 'accessory') {
                setType({ ...Type, name: 'Accessories' });
            } else if (type === 'component') {
                setType({ ...Type, name: 'Components' });
            } else {
                setType({ ...Type, name: '' });
            }
        } catch (error) {}
    };

    const formHandler = async (values) => {
        try {
            await axios.post('/employees/request', values);
            formRef.current.resetForm();
            setType({ ...Type, name: '' });
        } catch {}
    };

    useEffect(() => {
        try {
            axios.get(`/employees/dependent/information`).then(({ data }) => {
                setType({
                    name: '',
                    data: { Assets: data.asset, Accessories: data.accessory, Components: data.component },
                });
            });
        } catch (error) {}
    }, []);

    return (
        <div className="flex h-[calc(100vh_-_68px)] w-full items-center justify-center">
            <div className="w-full max-w-lg">
                <div className="border-gray-900/10">
                    <Formik innerRef={formRef} initialValues={params} onSubmit={formHandler}>
                        {({ isSubmitting, setFieldValue }) => (
                            <Form className="w-full space-y-5  bg-white py-[25px]">
                                <div className="space-y-5">
                                    <div>
                                        <label className="form-label">Request type</label>

                                        <Field as="select" name="request_type" className="form-select rounded-l-none">
                                            <option value="">Select Request</option>
                                            <option value="new">New</option>
                                            <option value="replace">Replace</option>
                                        </Field>
                                    </div>
                                    <div>
                                        <label className="form-label">Type</label>

                                        <Field
                                            as="select"
                                            name="type"
                                            className="form-select rounded-l-none"
                                            onChange={(e) => {
                                                setFieldValue('type', e.target.value);
                                                handleType(e.target.value);
                                            }}
                                        >
                                            <option value="">Select Type name</option>
                                            <option value="asset">Asset</option>
                                            <option value="accessory">Accessory</option>
                                            <option value="component">Component</option>
                                        </Field>
                                    </div>
                                    {Type?.name && (
                                        <>
                                            <div>
                                                <label className="form-label">{Type?.name}</label>

                                                <Field
                                                    as="select"
                                                    name="sub_type"
                                                    className="form-select rounded-l-none"
                                                >
                                                    <option value="">Select {Type?.name} name</option>
                                                    {Type?.data[Type?.name]?.map((data) => {
                                                        return (
                                                            <option key={data.id} value={data.name}>
                                                                {data.name}
                                                            </option>
                                                        );
                                                    })}
                                                </Field>
                                            </div>
                                            <div>
                                                <label className="form-label">Description</label>

                                                <Field
                                                    as="textarea"
                                                    name="description"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Description"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div>
                                    <ButtonField type="submit" loading={isSubmitting} className="btn block w-full">
                                        Submit
                                    </ButtonField>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default SendRequest;

SendRequest.middleware = {
    auth: true,
    verify: true,
};
