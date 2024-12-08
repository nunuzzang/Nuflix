import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { getTVs, IGetTvsResult } from "../api";
import { makeImagePath, useWindowDimensions } from "../utils";
import { useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const SliderArea = styled.div`
    width: 100%;
    height: 1000px;
`;

const Slider = styled(motion.div)`
    display: flex;
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div) <{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child{
    transform-origin: center left;
  }
  &:last-child{
    transform-origin: center right;
  }
`;

const ArrowLeft = styled(motion.div)`
    width: 50px;
    height: 50px;
    position: relative;
    background-color:  ${(props) => props.theme.black.lighter};
    top: 75px;
    z-index: 1;
    border-radius: 50px;
    font-size: 34px;
    text-align: center;
`;

const ArrowRight = styled(motion.div)`
    width: 50px;
    height: 50px;
    position: absolute;
    background-color:  ${(props) => props.theme.black.lighter};
    top: 75px;
    right: 0;
    z-index: 1;
    border-radius: 50px;
    font-size: 34px;
    text-align: center;
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4{
        text-align: center;
        font-size: 18px;
    }
`;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    background-color: rgba(0,0,0,0.5);
`;

const BigTv = styled(motion.div)`
    position: fixed;
    width: 40vw;
    height: 80vh;
    top: 100;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.img`
    width: 100%;
    height: 200px;
    background-size: cover;
    background-position: center center;
`;

const BigTitle = styled.h3`
    Color: ${(props) => props.theme.white.lighter};
    padding: 10px;
    font-size: 46px;
    position: relative;
    top: -80px;
`;

const BigOverview = styled.p`
    padding: 20px;
    position: relative;
    top: -80px;
    Color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = (direction: boolean) => ({
    hidden: {
        x: direction ? window.outerWidth + 5 : -window.outerWidth - 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: direction ? -window.outerWidth - 5 : window.outerWidth + 5,
    },
});

const BoxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween",
        }
    }

}

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween",
        }
    }

}

const arrowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
};




const offset = 6;






function Home() {
    const navigate = useNavigate();
    const bigTvMatch: PathMatch<string> | null = useMatch("/tv/:tvId");
    const width = useWindowDimensions();
    const { data, isLoading } = useQuery<IGetTvsResult>(
        {
            queryKey: ['tv', "airingToday"],
            queryFn: getTVs
        });
    console.log(data)
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalTv = data.results.length - 1;        //-1 이유는 배경에서 하나 사용중
            const maxIndex = Math.floor(totalTv / offset) - 1;    //-1 이유는 page가 0부터 시작
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    }
    const decreaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalTv = data.results.length - 1;        //-1 이유는 배경에서 하나 사용중
            const maxIndex = Math.floor(totalTv / offset) - 1;    //-1 이유는 page가 0부터 시작
            setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
        }
    }

    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (tvId: number) => {
        navigate(`/tv/${tvId}`);
    }
    const onOverlayClick = () => navigate("/");
    const clickedTv = bigTvMatch?.params.tvId && data?.results.find(tv => String(tv.id) === bigTvMatch.params.tvId);
    const [direction, setDirection] = useState(false);
    const changeRight = () => setDirection(true)
    const changeLeft = () => setDirection(false)
    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
                    >
                        <Title>{data?.results[0].name}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>

                    <SliderArea>
                        <Slider >
                            <AnimatePresence>
                                <ArrowLeft
                                    variants={arrowVariants}
                                    initial="hidden"
                                    whileHover="visible"
                                    exit="hidden"
                                    onMouseEnter={changeLeft} onClick={decreaseIndex}>{"<"}</ArrowLeft>
                                <ArrowRight
                                    variants={arrowVariants}
                                    initial="hidden"
                                    whileHover="visible"
                                    exit="hidden"
                                    onMouseEnter={changeRight} onClick={increaseIndex}>{">"}</ArrowRight>
                            </AnimatePresence>
                            <AnimatePresence
                                initial={false}
                                onExitComplete={toggleLeaving}>
                                <Row
                                    variants={rowVariants(direction)}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 1 }}
                                    key={index}
                                >
                                    {data?.results
                                        .slice(1)
                                        .slice(offset * index, offset * index + offset)
                                        .map((tv) => (
                                            <Box
                                                layoutId={tv.id + ""}
                                                key={tv.id}
                                                initial="normal"
                                                whileHover="hover"
                                                variants={BoxVariants}
                                                onClick={() => onBoxClicked(tv.id)}
                                                transition={{ type: "tween" }}
                                                bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                                            >
                                                <Info
                                                    variants={infoVariants}
                                                >
                                                    <h4>{tv.name}</h4>
                                                </Info>
                                            </Box>
                                        ))}
                                </Row>
                            </AnimatePresence>
                        </Slider>
                    </SliderArea>
                    <AnimatePresence>
                        {bigTvMatch ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClick}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                                <BigTv
                                    layoutId={bigTvMatch.params.tvId}
                                >
                                    {clickedTv && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedTv.backdrop_path,
                                                        "w500"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>{clickedTv.name}</BigTitle>
                                            <BigOverview>{clickedTv.overview}</BigOverview>
                                        </>
                                    )}
                                </BigTv>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )
            }
        </Wrapper >
    );
}
export default Home;