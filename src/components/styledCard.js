import styled from "styled-components";

const StyledCard = styled.div`
    .card {
        position: relative;

        background: #fff;
        width: 300px;
        padding-bottom: 20px;
        margin-right: 20px;
        margin-bottom: 20px;
        min-height: 180px;
    }

    .card a {
        text-decoration: none;
    }

    .card .card-empty-image {
        background: #EAEAED;
        height: 126px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .card .empty-card-image {
        padding: 10px;
        height: 160px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .card .empty-card-image img {
        width: 70px;
    }

    .card h2 {
        margin: 0;
        color: #353537;
        padding: 0 10px;
        margin: 10px 0;
        font-size: 18px;
    }

    .card img {
        max-width: 100%;
    }

    .card p {
        margin: 0;
        color: #353537;
        padding: 0 10px;
        margin: 10px 0 0;
        font-size: 16px;
        line-height: 150%;
    }

    .card-empty-image {
        position: relative;
    }

    .card-image-wrap {
        position: relative;
        min-height: 150px;
    }

    .card-image-wrap img {
        max-width: 100%;
        overflow: hidden;
    }

    .card-image-wrap .card-actions {
        position: absolute;
        background: rgba( 255,255,255, .7 );
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        display: none;
        z-index: 3;
    }

    .card-image-wrap:hover .card-actions {
        display: flex;
    }

    .card-image-wrap .card-actions button,
    .card-image-wrap .card-actions a.btn {
        background: none;
        border: none;
        font-size: 14px;
        cursor: pointer;
        padding: 5px;
        background: #fff;
        margin: 0 5px 0 0;
        text-decoration: none;
        color: #000;
    }

    .card-image-wrap .card-actions button.add-image {
        position: relative;
        cursor: pointer;
    }

    .card-image-wrap .card-actions button.add-image input {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        z-index: 4;
        top: 0;
        left: 0;
    }

    .card-image-wrap .card-actions button.danger-bg-color {
        background: #DA344D;
    }

    .card-image-wrap .card-actions button.danger-color {
        color: #F4F0EE;
    }

    .card-image-wrap .card-actions button:hover {
        text-decoration: underline;
    }

    .card-recipe .name-parsed,
    .card-step .description-parsed {
        display: block;
    }

    .card-recipe .name-parsed:hover,
    .card-step .description-parsed:hover {
        background: #fff;
    }

    .card-recipe .name-marked,
    .card-step .description-marked {
        display: none;
        font-size: 16px;
        font-weight: normal;
        background: #ffff;
    }

    .card-recipe .name-marked:focus,
    .card-step .description-marked:focus {
        outline: none;
    }

    .card-recipe.active .name-parsed,
    .card-step.active .description-parsed {
        display: none;
    }

    .card-recipe.active .name-marked,
    .card-step.active .description-marked {
        display: block;
    }

    .card-recipe-link {
        text-decoration: none;
    }

    .card-recipe-link:hover {
        text-decoration: underline;
    }
`;

export default StyledCard;
