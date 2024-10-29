import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    
    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    
    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <div className="rowW-M">
                <div className="delete-box">
                    <div className="rowW">
                        <div className="profile-title">
                            Dzēst kontu
                        </div>
                    </div>

                    <p className="lable-small">
                        Kad konts tiks dzēsts, to vairs nebūs iespējams atjaunot,
                        un visi dati tiks zaudēti. Pirms šī lēmuma pieņemšanas
                        rūpīgi izvērtē savu lēmumu.
                    </p>

                    <div className="rowW-M7">
                        <DangerButton onClick={confirmUserDeletion}>
                            Dzēst kontu
                        </DangerButton>
                    </div>
                </div>
            </div>

            {/* Modal for user deletion confirmation */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                <div className="settings-T">
                                 Informācija
                                </div>
                    <h2 className="lable2">
                        Esi pārliecināts dzēst savu kontu?
                    </h2>

                    <p className="lable-small">
                        Kad jūsu konts tiks dzēsts, visi tā resursi un
                        dati tiks neatgriezeniski izdzēsti. Lūdzu, ievadiet savu
                        paroli, lai apstiprinātu, ka vēlaties neatgriezeniski
                        dzēst savu kontu.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Parole"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Parole"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button className="secondary-button2"  onClick={closeModal}>
                            Atcelt
                        </button>

                        <DangerButton className="ms-3" disabled={processing}>
                            Dzēst kontu
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
