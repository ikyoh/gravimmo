import { Button, ButtonSize } from "components/button/Button";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FormSubmitButton } from "../submit-button/FormSubmitButton";

const Form = ({
    children,
    onSubmit,
    isLoading,
    isDisabled,
    steps = 1,
    currentStep = 1,
    errors = false,
    handleNextStep,
    handlePrevStep,
}) => {
    console.log("steps", steps);
    console.log("currentStep", currentStep);
    return (
        <form className="flex flex-col h-full" onSubmit={onSubmit}>
            <div className="px-1 pt-3 grow">{children}</div>
            <div className="sticky bottom-0 pt-6 pb-9 md:py-4 mt-6 border-t border-slate-600 bg-white dark:bg-dark dark:bg-gradient-modal-footer">
                <div className="grid grid-cols-3">
                    <div className="place-self-start">
                        {currentStep > 1 && (
                            <Button
                                size={ButtonSize.Big}
                                onClick={handlePrevStep}
                            >
                                <MdChevronLeft />
                            </Button>
                        )}
                    </div>
                    <div className="place-self-center">
                        {steps === currentStep && (
                            <FormSubmitButton
                                isLoading={isLoading}
                                isDisabled={isDisabled}
                            />
                        )}
                    </div>
                    <div className="place-self-end">
                        {currentStep < steps && (
                            <Button
                                size={ButtonSize.Big}
                                onClick={handleNextStep}
                                disabled={false}
                            >
                                <MdChevronRight />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Form;
