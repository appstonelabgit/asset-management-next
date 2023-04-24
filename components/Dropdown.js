import ReactDOM from 'react-dom';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

const Dropdown = (props, forwardedRef) => {
    const [visibility, setVisibility] = useState(false);

    const referenceRef = useRef();
    const popperRef = useRef();

    const { styles, attributes } = usePopper(referenceRef.current, popperRef.current, {
        placement: props.placement || 'bottom-end',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: props.offset || [(0, 0)],
                },
            },
        ],
        strategy: props.strategy || 'fixed',
    });

    const handleDocumentClick = (event) => {
        if (referenceRef.current.contains(event.target) || popperRef.current.contains(event.target)) {
            return;
        }

        setVisibility(false);
    };

    const handleEvents = (event) => {
        const mouseEvent = props.event ? props.event : 'click';
        if (mouseEvent === 'hover') {
            if (event._reactName === 'onMouseLeave') {
                setVisibility(false);
            }
            if (event._reactName === 'onMouseEnter') {
                setVisibility(true);
            }
        } else if (event._reactName === 'onClick') {
            setVisibility(!visibility);
        }
    };
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleDocumentClick);
        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, []);

    useImperativeHandle(forwardedRef, () => ({
        close() {
            setVisibility(false);
        },
    }));

    return (
        <>
            {mounted && (
                <>
                    <button
                        ref={referenceRef}
                        type="button"
                        className={props.btnClassName}
                        onClick={handleEvents}
                        onMouseEnter={handleEvents}
                        onMouseLeave={handleEvents}
                    >
                        {props.button}
                    </button>

                    {typeof props.usePortal !== 'undefined' && props.usePortal === false ? (
                        <div
                            ref={popperRef}
                            style={styles.popper}
                            {...attributes.popper}
                            className="z-10 w-full overflow-hidden rounded bg-white p-0 shadow"
                        >
                            {visibility && props.children}
                        </div>
                    ) : (
                        ReactDOM.createPortal(
                            <div
                                ref={popperRef}
                                style={styles.popper}
                                {...attributes.popper}
                                className="z-10 overflow-hidden rounded bg-white p-0 shadow"
                            >
                                {visibility && props.children}
                            </div>,
                            document.querySelector('#popper-portal')
                        )
                    )}
                </>
            )}
        </>
    );
};

export default forwardRef(Dropdown);
