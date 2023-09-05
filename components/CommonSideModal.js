import ReactDOM from 'react-dom';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import IconClose from '@/components/Icon/IconClose';
const CommonSideModal = (
    { children, width, closeOnEsc = true, backdrop = true, closeButoon = true, title = '' },
    forwardedRef
) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    const modalPanelRef = useRef();
    const openModal = () => {
        setIsOpen(true);
        document.addEventListener('keydown', handleEscKey);
    };
    const closeModal = () => {
        setIsOpen(false);
        document.removeEventListener('keydown', handleDocumentClick);
    };
    const closeByBackdrop = () => {
        if (backdrop) {
            closeModal();
        }
    };
    const handleDocumentClick = (event) => {
        if (modalPanelRef?.current?.contains(event.target)) {
            return;
        }
        closeModal();
    };
    const handleEscKey = (e) => {
        if (closeOnEsc && (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27)) {
            closeModal();
        }
    };
    useImperativeHandle(forwardedRef, () => ({
        open() {
            openModal();
        },
        close() {
            closeModal();
        },
    }));
    return (
        <>
            {mounted &&
                ReactDOM.createPortal(
                    isOpen && (
                        <>
                            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70">
                                <div
                                    className="z-50 flex min-h-full items-center justify-center p-4"
                                    onClick={() => closeByBackdrop()}
                                >
                                    <div
                                        ref={modalPanelRef}
                                        className="relative min-h-[500px] w-full min-w-full rounded-md bg-white px-5 pt-7 text-left align-middle shadow-xl transition-all sm:min-w-[400px]"
                                        style={{ maxWidth: width || '1024px' }}
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-bold text-darkprimary">{title}</h2>

                                            {closeButoon && (
                                                <div
                                                    className="cursor-pointer rounded-full bg-lightblue p-2 hover:opacity-70"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <IconClose className="h-3 w-3" />
                                                </div>
                                            )}
                                        </div>
                                        {isOpen && children}
                                    </div>
                                </div>
                            </div>
                        </>
                    ),

                    document?.querySelector('#offsetright-portal')
                )}
        </>
    );
};
export default forwardRef(CommonSideModal);
