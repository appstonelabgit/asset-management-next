import React, { useEffect, useRef, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import ButtonField from '@/components/Field/ButtonField';
import axios from '@/libs/axios';

const Request = () => {
    const formRef = useRef();

    const defaultParams = {
        id: '',
        request_type: '',
        type: '',
        subType: '',
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
            }
        } catch (error) {}
    };

    const formHandler = async (values) => {
        try {
            await axios.post('/request', values);
            formRef.current.resetForm();
        } catch {}
    };

    useEffect(() => {
        try {
            axios.get(`/request/dependent/information`).then(({ data }) => {
                setType({
                    ...Type,
                    name: 'Assets',
                    data: { Assets: data.assets, Accessories: data.accessories, Components: data.components },
                });
            });
        } catch (error) {}
    }, []);

    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <div className="w-full max-w-lg space-y-12">
                <div className="border-gray-900/10">
                    <Formik innerRef={formRef} initialValues={params} onSubmit={formHandler}>
                        {({ isSubmitting, setFieldValue }) => (
                            <Form className="w-full space-y-5  bg-white p-[25px]">
                                <div className="space-y-5">
                                    <div>
                                        <label className="form-label">Reqest type</label>

                                        <Field as="select" name="seller_id" className="form-select rounded-l-none">
                                            <option value="">Select Reqest</option>
                                            <option value="new">New</option>
                                            <option value="issue">Issue</option>
                                        </Field>
                                    </div>
                                    <div>
                                        <label className="form-label">Type</label>

                                        <Field
                                            as="select"
                                            name="seller_id"
                                            className="form-select rounded-l-none"
                                            onChange={(e) => handleType(e.target.value)}
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
                                                    name="seller_id"
                                                    className="form-select rounded-l-none"
                                                >
                                                    <option value="">Select {Type?.name} name</option>
                                                    {Type?.data[Type?.name]?.map((data) => {
                                                        return (
                                                            <option key={data.id} value={data.id}>
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

export default Request;

Request.middleware = {
    auth: true,
    verify: true,
};
