import React from "react";
import apiService from "../helpers/apiService";
import StyledCard from "./styledCard";

function Step( props ) {
    const { step, index, setRecipe, id, recipe, token, authorisation } = props;

    const descriptionRef = React.useRef( null );

    const [textAreaHeight, setTextAreaHeight] = React.useState( "auto" );
    const [descriptionEditable, setDescriptionEditable] = React.useState( false );

    React.useEffect( () => {
        if ( !token || !authorisation ) {
            return;
        }
        setTextAreaHeight( descriptionRef.current.scrollHeight )
        descriptionRef.current.focus();
    }, [authorisation, descriptionEditable, token] )

    const updateRecipeWithImage = (imagePath, stepIndex) => {
        const handleError = () => {

        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe );
        }

        apiService({
            path: `/api/recipes/${ id }`,
            method: "PUT",
            body: {...recipe, steps: recipe.steps.map( (step, index) => {
                if ( index === stepIndex) {
                    return {
                        ...step,
                        path: imagePath
                    }
                }

                return step;
            } ) }
        }).then( handleSuccess, handleError );
    }

    const handleImageUpload = (evt, index) => {
        const formData = new FormData();

        formData.append( "media", evt.target.files[ 0 ] );

        const handleError = () => {

        }

        const handleSuccess = (res) => {
            updateRecipeWithImage(res.image.path, index)
        }

        apiService( {
            path: "/api/upload",
            method: "POST",
            body: formData,
            type: "fileUpload"
        } ).then( handleSuccess, handleError );
    }

    const handleStepImageDelete = (stepIndex) => {
        const handleError = () => {

        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe );
        }

        apiService({
            path: `/api/recipes/${ id }`,
            method: "PUT",
            body: {...recipe, steps: recipe.steps.map( (step, index) => {
                if ( index === stepIndex) {
                    return {
                        ...step,
                        path: ""
                    }
                }

                return step;
            } ) }
        }).then( handleSuccess, handleError );
    }

    const handleStepDelete = (stepIndex) => {
        const handleError = () => {

        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe );
        }

        apiService({
            path: `/api/recipes/${ id }`,
            method: "PUT",
            body: {...recipe, steps: recipe.steps.filter( (step, index) => {
                if ( index === stepIndex) {
                    return false
                }

                return step;
            } ) }
        }).then( handleSuccess, handleError );
    }

    function handleTextareaChange(evt) {
        evt.target.style.height = "auto";
        evt.target.style.height = `${ evt.target.scrollHeight }px`;
    }

    const handleDescriptionBlur = (evt) => {
        setDescriptionEditable( false );
        const value = evt.currentTarget.value;

        setRecipe(oldRecipe => {
            const handleError = () => {

            }

            const handleSuccess = (res) => {
                setRecipe( res.recipe )
            }

            apiService({
                path: `/api/recipes/${ id }`,
                method: "PUT",
                body: {...oldRecipe, steps: oldRecipe.steps.map( (stp, ind) => {
                    if (ind === index) {
                        return {
                            ...stp,
                            description: value
                        }
                    }

                    return stp;
                } ) }

            }).then( handleSuccess, handleError );

            return {...oldRecipe, description: value }
        });
    }

    const descriptionEditableClass = descriptionEditable ? "active" : "";

    return (
        <StyledCard>
            { token && authorisation && (
                <div className={`${descriptionEditableClass} card card-step`} key={ step.path }>
                    {
                        step.path && (
                            <div className="card-image-wrap">
                              <div className="card-actions">
                                  <button onClick={ () => handleStepDelete(index) }>delete step</button>
                                  <button onClick={ () => handleStepImageDelete(index) }>delete image</button>
                              </div>
                              <img src={`${ step.path }`} alt="" />
                            </div>
                        )
                    }

                    {
                        !step.path && (
                            <div className="card-image-wrap">
                              <div className="card-actions">
                                  <button onClick={ () => handleStepDelete(index) }>delete step</button>
                                  <button className="add-image">
                                      add image
                                      <input type="file" name="media" id="" onChange={ evt => handleImageUpload(evt,index) }/>
                                  </button>
                              </div>
                              <div className="card-empty-image"></div>
                            </div>
                        )
                    }
                    <p className="description-parsed" onClick={() => setDescriptionEditable(true)}>
                        { step.description || "Description placeholder" }
                    </p>
                    <textarea
                        style={ { height: `${ textAreaHeight }px`, overflowY: "hidden" } }
                        onChange={ handleTextareaChange }
                        defaultValue={ step.description || "" }
                        ref={descriptionRef}
                        onBlur={ handleDescriptionBlur }
                        className="description-marked"
                    />
                </div>
            ) }
            {
                (!token || !authorisation) && (
                    <div className="card card-step" key={ step.path }>
                        {
                            step.path && (
                                <div className="card-image-wrap">
                                  <img src={`${ step.path }`} alt="" />
                                </div>
                            )
                        }

                        {
                            !step.path && (
                                <div className="card-image-wrap">
                                  <div className="card-empty-image"></div>
                                </div>
                            )
                        }
                        <p className="description-parsed no-hover">
                            { step.description }
                        </p>
                    </div>
                )
            }
        </StyledCard>
    )
}

export default Step
