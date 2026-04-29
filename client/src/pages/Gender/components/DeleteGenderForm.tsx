import { useEffect, useState, type FormEvent } from "react"
import BackButton from "../../../components/Button/BackButton"
import SubmitButton from "../../../components/Button/SubmitButton"
import FloatingLabelInput from "../../../components/Inputs/FloatingLabelInput"
import { useNavigate, useParams } from "react-router-dom"
import GenderService from "../../../services/GenderService"
import Spinner from "../../../components/Spinner/Spinner"


const DeleteGenderForm = () => {

    const [loadingGet, setloadingGet] = useState(false)
    const [loadingDestroy, setLoadingDestroy] = useState(false)
    const [gender, setGender] = useState('')

    const { gender_id } = useParams()
    const navigate = useNavigate()

    const handleGetGender = async (genderId: string | number) => {
        try {
            setloadingGet(true);

            const res = await GenderService.getGender(genderId);

            if (res.status === 200) {
                setGender(res.data.gender.gender);
            } else {
                console.error("Unexpected status error occured during getting gender: ", res.status)
            };
        } catch (error) {
            console.error("Unexpected server error occured during getting gender: ", error)
        } finally {
            setloadingGet(false)
        }
    };

    const handleDestroyGender = async (e: FormEvent) => {
        try {
            e.preventDefault()
            setLoadingDestroy(true)
            const res = await GenderService.destroyGender(gender_id!)

            if (res.status === 200) {
                navigate('/genders', { state: { message: res.data.message } })
            } else {
                console.error("Unexpected status error occured during deleting gender: ", res.status)
            }
        } catch (error) {
            console.error("Unexpected server error occured during deleting gender: ", error)
        } finally {
            setLoadingDestroy(false)
        }
    }

    useEffect(() => {
        if (gender_id) {
            const parsedGenderId = parseInt(gender_id)
            handleGetGender(parsedGenderId)
        } else {
            console.error("Unexpected parameter error occured during getting gender: ",
                gender_id
            );
        }
    }, [gender_id]);

    return (
        <>
            {loadingGet ? (
                <div className="flex justify-center items-center mt-52">

                    <Spinner size="lg">

                    </Spinner>
                </div>
            ) : (

                <form onSubmit={handleDestroyGender}>
                    <div className="mb-4">
                        <FloatingLabelInput
                            label="Gender"
                            type="text"
                            name="gender"
                            value={gender}
                            readOnly
                        >
                        </FloatingLabelInput>
                    </div>

                    <div className="flex justify-end gap-2">
                        {!loadingDestroy && (
                            <BackButton label="Back" path="/genders"></BackButton>
                        )}
                        <SubmitButton
                            label="Delete Gender"
                            className="bg-red-500 hover:bg-red-700 text-white text-sm font-medium cursor-pointer py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            loading={loadingDestroy}
                            loadingLabel="Deleting Gender..."
                        >
                        </SubmitButton>
                    </div>

                </form>
            )}
        </>
    )
}

export default DeleteGenderForm