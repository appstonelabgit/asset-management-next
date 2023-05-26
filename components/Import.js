import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Modal from '@/components/Modal';
import axios from '@/libs/axios';
import { Field, Form, Formik } from 'formik';
import ButtonField from './Field/ButtonField';
import Link from 'next/link';

const Import = (props, forwardedRef) => {
    const modal = useRef();
    const defaultParams = { data: '' };

    const [params, setParams] = useState(defaultParams);

    useImperativeHandle(forwardedRef, () => ({
        open() {
            modal?.current.open();
        },
        close() {
            modal?.current.close();
        },
    }));

    const formHandler = async (values) => {
        try {
            const formData = new FormData();
            formData.append('data', values.data);
            await axios.post(`/${props.type}/file/import`, formData);
            props.refresh();
            modal?.current.close();
        } catch {}
    };

    return (
        <div>
            <Modal ref={modal} title="Add User">
                <div className="space-y-12">
                    <div className="border-gray-900/10 ">
                        <Formik initialValues={params} onSubmit={formHandler}>
                            {({ isSubmitting, setFieldValue }) => (
                                <Form>
                                    <div>
                                        <label className="form-label">Import CSV File</label>

                                        <input
                                            name="data"
                                            type="file"
                                            className="form-input mt-5"
                                            onChange={(e) => {
                                                setFieldValue('data', e.target.files[0]);
                                            }}
                                        />
                                        <Link href={props.csvPath} className="btn-secondary block">
                                            Download Sample csv
                                        </Link>
                                    </div>

                                    <div className="mt-5">
                                        <ButtonField type="submit" loading={isSubmitting} className="btn">
                                            Import
                                        </ButtonField>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default forwardRef(Import);
