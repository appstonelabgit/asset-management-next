import axios from '@/libs/axios';
import { Field, Form, Formik } from 'formik';
import ButtonField from '../Field/ButtonField';

const CompanyInsertForm = ({ redirect }) => {
    const params = { company_name: ''};

    const formHandler = async (values) => {
        try {
            const formData = new FormData();
            formData.append("company_logo_url", values.company_logo_url)
            formData.append("company_name", values.company_name)


            await axios.post('/company', formData);
            if (redirect) {
                window.location = redirect;
            }
        } catch {}
    };

    return (
        <div className="mt-5 w-full space-y-6">
            <h3 className="w-full text-center text-[22px] font-semibold leading-7">Add a company</h3>
            <Formik initialValues={params} onSubmit={formHandler}>
                {({ isSubmitting, setFieldValue }) => (
                    <Form className="w-full space-y-5 border border-lightblue bg-white p-[25px]">
                        <div className='space-y-5'>
                            <div>
                                <label className="form-label">Company name</label>

                                <Field
                                    name="company_name"
                                    type="text"
                                    className="form-input rounded-l-none"
                                    placeholder="company name"
                                />
                            </div>
                            <div>
                                <label className="form-label">Company logo</label>

                                <input
                                    name="company_logo_url"
                                    type="file"
                                    className="form-input rounded-l-none"
                                    onChange={(e)=>setFieldValue('company_logo_url', e.target.files[0])}
                                />
                            </div>
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
    );
};

export default CompanyInsertForm;
