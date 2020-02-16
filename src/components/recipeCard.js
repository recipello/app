import React from "react";
import { Link } from "react-router-dom";
import apiService from "../helpers/apiService";
import StyledCard from "./styledCard";

function RecipeCard (props) {
    const { recipeProps, index, getRecipes, token } = props;

    const [ recipe, setRecipe ] = React.useState( recipeProps )

    const nameRef = React.useRef(null);

    const [ nameEditable, setNameEditable ] = React.useState(false);
    const [textAreaHeight, setTextAreaHeight] = React.useState( "auto" );

    React.useEffect( () => {
        if (!token) {
            return;
        }

        setTextAreaHeight( nameRef.current.scrollHeight )
        nameRef.current.focus();

    }, [nameEditable, token] )

    const recipeEditableClass = nameEditable ? "active" : "";

    const handleRecipeDelete = () => {
        const handleSuccess = () => {
            getRecipes();
        }

        const handleError = (err) => {
            console.log(err);
        }

        apiService({
            path: `/api/recipes/${ recipe._id }`,
            method: "DELETE",
        }).then( handleSuccess, handleError );
    };

    const handleRecipeImageDelete = () => {
        const handleSuccess = (res) => {
            setRecipe( res.recipe );
        }

        const handleError = (err) => {
            console.log(err);
        }

        apiService({
            method: "PUT",
            path: `/api/recipes/${ recipe._id }`,
            body: {...recipe, coverPhoto: "" }
        }).then( handleSuccess, handleError );
    }

    const updateRecipeWithImage = (imagePath) => {
        const handleError = (err) => {
            console.log(err);
        }

        const handleSuccess = (res) => {
            setRecipe( res.recipe );
        }

        apiService({
            path: `/api/recipes/${ recipe._id }`,
            method: "PUT",
            body: {...recipe, coverPhoto: imagePath }
        }).then( handleSuccess, handleError );
    }

    const handleImageUpload = (evt) => {
        const formData = new FormData();
        formData.append( "media", evt.target.files[ 0 ] );

        const handleSuccess = (res) => {
            updateRecipeWithImage(res.image.path)
        }

        const handleError = (err) => {
            console.log(err);
        }

        apiService({
            path: "/api/upload",
            method: "POST",
            body: formData,
            type: "fileUpload"
        }).then( handleSuccess, handleError );
    }

    const handleTextareaChange = () => {

    }

    const handleNameBlur = () => {

    };

    return (
        <StyledCard>
        {
            !token && (
                <Link className="card-recipe-link" to={ `/r/${recipe._id}` }>
                    <div className="card card-recipe" key={ recipe._id }>
                        <div className="card-image-wrap">
                          <img src={`${ recipe.coverPhoto }`} alt="" />
                        </div>
                        <p className="name-parsed">
                            { recipe.name }
                        </p>
                    </div>
                </Link>
            )
        }
        {
            token && (
                <div className={`${recipeEditableClass} card card-recipe`} key={ recipe._id }>
                    {
                        recipe.coverPhoto && (
                            <div className="card-image-wrap">
                              <div className="card-actions">
                                  <button className="danger-bg-color danger-color" onClick={ () => handleRecipeDelete(index) }>delete recipe</button>
                                  <button onClick={ handleRecipeImageDelete }>delete image</button>
                                  <Link className="btn" to={ `/r/${recipe._id}` }>go to recipe</Link>
                              </div>
                              <img src={`${ recipe.coverPhoto }`} alt="" />
                            </div>
                        )
                    }

                    {
                        !recipe.coverPhoto && (
                            <div className="card-image-wrap card-empty-image">
                              <div className="card-actions">
                                  <button className="danger-bg-color danger-color" onClick={ () => handleRecipeDelete(index) }>delete recipe</button>
                                  <button className="add-image">
                                      add image
                                      <input type="file" name="media" id="" onChange={ evt => handleImageUpload(evt,index) }/>
                                  </button>
                                  <Link className="btn" to={ `/r/${recipe._id}` }>go to recipe</Link>
                              </div>
                              <div className="card-empty-image"></div>
                            </div>
                        )
                    }
                    <p className="name-parsed" onClick={() => setNameEditable(true)}>
                        { recipe.name || "Recipe name placeholder" }
                    </p>
                    <textarea
                        style={ { height: `${ textAreaHeight }px`, overflowY: "hidden" } }
                        onChange={ handleTextareaChange }
                        defaultValue={ recipe.name || "" }
                        ref={nameRef}
                        onBlur={ handleNameBlur }
                        className="name-marked"
                    />
                </div>
            )
        }
        </StyledCard>
    )
}

export default RecipeCard;
