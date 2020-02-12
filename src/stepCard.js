import React from "react";
const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

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
        const url = `${baseUrl}/api/recipes/${ id }`;

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify({...recipe, steps: recipe.steps.map( (step, index) => {
                if ( index === stepIndex) {
                    return {
                        ...step,
                        path: imagePath
                    }
                }

                return step;
            } ) })
        };

        const handleError = () => {

        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe );
        }

        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
    }

    const handleImageUpload = (evt, index) => {
        const formData = new FormData();
        const url = `${baseUrl}/api/upload`;

        formData.append( "media", evt.target.files[ 0 ] );

        const handleError = () => {

        }

        const handleSuccess = (res) => {
            console.log(res);

            updateRecipeWithImage(res.image.path, index)
        }

        fetch( url, {
            method: "POST",
            headers: {
                "x-access-token": token
            },
            body: formData,
        } ).then( res => res.json() ).then( handleSuccess, handleError );
    }

    const handleStepImageDelete = (stepIndex) => {
        const url = `${baseUrl}/api/recipes/${ id }`;

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify({...recipe, steps: recipe.steps.map( (step, index) => {
                if ( index === stepIndex) {
                    return {
                        ...step,
                        path: ""
                    }
                }

                return step;
            } ) })
        };

        const handleError = () => {

        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe );
        }

        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
    }

    const handleStepDelete = (stepIndex) => {
        const url = `${baseUrl}/api/recipes/${ id }`;

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            },
            body: JSON.stringify({...recipe, steps: recipe.steps.filter( (step, index) => {
                if ( index === stepIndex) {
                    return false
                }

                return step;
            } ) })
        };

        const handleError = () => {

        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe );
        }

        fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );
    }

    function handleTextareaChange(evt) {
        evt.target.style.height = "auto";
        evt.target.style.height = `${ evt.target.scrollHeight }px`;
    }

    const handleDescriptionBlur = (evt) => {
        setDescriptionEditable( false );
        const value = evt.currentTarget.value;
        setRecipe(oldRecipe => {
            const url = `${baseUrl}/api/recipes/${ id }`;

            const options = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
                body: JSON.stringify({...oldRecipe, steps: oldRecipe.steps.map( (stp, ind) => {
                    if (ind === index) {
                        return {
                            ...stp,
                            description: value
                        }
                    }

                    return stp;
                } ) })
            };

            const handleError = () => {

            }

            const handleSuccess = (res) => {
                setRecipe( res.recipe )
            }

            fetch( url, options ).then( res => res.json() ).then( handleSuccess, handleError );

            return {...oldRecipe, description: value }
        });
    }

    const descriptionEditableClass = descriptionEditable ? "active" : "";

    return (
        <>
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
        </>
    )
}

export default Step
