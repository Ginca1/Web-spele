import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';


export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'modal-sm',
        md: 'modal-md',
        lg: 'modal-lg',
        xl: 'modal-xl',
        '2xl': 'modal-2xl',
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="modal-overlay"
                onClose={close}
            >
                <TransitionChild
                    enter="modal-enter"
                    enterFrom="modal-enter"
                    enterTo="modal-enter-active"
                    leave="modal-exit"
                    leaveFrom="modal-exit"
                    leaveTo="modal-exit-active"
                >
                    <div className="modal-overlay" />
                </TransitionChild>

                <TransitionChild
                    enter="modal-enter"
                    enterFrom="modal-enter"
                    enterTo="modal-enter-active"
                    leave="modal-exit"
                    leaveFrom="modal-exit"
                    leaveTo="modal-exit-active"
                >
                    <DialogPanel className={`modal-content ${maxWidthClass}`}>
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
