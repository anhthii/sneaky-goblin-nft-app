import React from 'react';
import './HowToPlay.scss';

const HowToPlay = () => {
    return (
        <dl className="_how-to-play">
            <dt>The Goblinverse Invasion:</dt>
            <dd>
                By staking your Sneaky Goblins into the Goblinverse Invasion Campaign, you send your
                Goblins team to fight for $xSERUM as invaders.
            </dd>
            <dd>
                There are 5 different levels of Goblins that reflects their skills, brain power and
                cleverness. The level directly affects the $xSERUM yield. Higher levels are higher
                rarity.
            </dd>

            <dt>What’s the early benefits?</dt>
            <dd>
                Before reveal, all Sneaky Goblins will yield the same amount of $xSERUM based on
                level 1 yield. However, if you stake your Goblins from day 1 and all the way through
                the reveal, the yielded $xSERUM in your vault will update according to the REAL
                level of your Sneaky Goblin.
                <br /> Example: if you’ve been yielding 100 $xSERUM per day as a non-revealed Goblin
                and then your Goblin ends up being a Level 5, your $xSERUM in your vault will be
                updated based on level 5 yield RETROACTIVELY.
                <br />
                Requirement: The only requirement is that you keep your Goblin staked until reveal.
            </dd>

            <dt>What’s the daily $xSERUM yield?</dt>
            <dd>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Category</th>
                            <th scope="col">Yield/day</th>
                            <th scope="col">
                                Rarity <br />
                                (% of occurrence)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Level 1</th>
                            <td>100</td>
                            <td>35%</td>
                        </tr>
                        <tr>
                            <th scope="row">Level 2</th>
                            <td>120</td>
                            <td>25%</td>
                        </tr>
                        <tr>
                            <th scope="row">Level 3</th>
                            <td>140</td>
                            <td>20%</td>
                        </tr>
                        <tr>
                            <th scope="row">Level 4</th>
                            <td>150</td>
                            <td>15%</td>
                        </tr>
                        <tr>
                            <th scope="row">Level 5</th>
                            <td>200</td>
                            <td>5%</td>
                        </tr>
                    </tbody>
                </table>
            </dd>

            <dt>What wallet balance is used for future drops &amp; ecosystem spending?</dt>
            <dd>
                It’s the in-game wallet balance that is used to mint upcoming drops and to spend
                $xSERUM in our Goblinverse Ecosystem.
                <br />
                If you withdraw to ERC-20, you’ll need to re-deposit to be able to benefit from the
                ecosystem.
            </dd>

            <dt>What happens if I claim $xSERUM from in-game wallet to ERC-20?</dt>
            <dd>
                You can claim from in-game wallet to ERC-20 at any time. However, keep in mind that
                there is a 25% tax to the Goblin Nation Government doing so.
            </dd>
        </dl>
    );
};

export default HowToPlay;
