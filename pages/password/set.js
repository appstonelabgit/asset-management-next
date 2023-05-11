import { useAuth } from '@/hooks/useAuth';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Set = () => {
    const router = useRouter();
    const { setPassword } = useAuth();
    const params = { password: '', password_confirmation: '' };

    useEffect(() => {
        if (router.isReady && !router.query.token) {
            router.push('/users');
        }
    }, [router]);

    const formHandler = async (values) => {
        await setPassword(values);
    };

    return (
        <div className="min-h-screen ">
            <div className="flex min-h-[calc(100vh-77px)] items-center justify-center p-4">
                <div className="mx-auto w-full max-w-[600px] space-y-[25px] rounded bg-white p-[25px]">
                    <div className="flex flex-col items-center justify-center space-y-5 text-4xl font-extrabold text-darkprimary">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-darkprimary text-white">
                            A
                        </div>
                        <div className="text-3xl">Assets</div>
                    </div>
                    <h1 className="text-center text-[22px] font-semibold leading-7">Set Password</h1>

                    <Formik initialValues={params} onSubmit={formHandler}>
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="form-label">Password</label>
                                    <div>
                                        <Field
                                            name="password"
                                            type="password"
                                            className="form-input"
                                            placeholder="Password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="form-label">Confirm password</label>
                                    <div>
                                        <Field
                                            name="password_confirmation"
                                            type="password"
                                            className="form-input"
                                            placeholder="Confirm password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button disabled={isSubmitting} type="submit" className="btn mt-6 block w-full">
                                        Reset Password
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default set;

Set.middleware = {
    auth: true,
};

Set.layout = 'nosidebar';
