AngularAbTests is an [angular](https://angular.io/) module that helps you setting up **easily** and **clearly** any AB or multivariate test.

It will **make your tests easy to debug and understand**, regardless of how complex they are, of how many versions you are setting up, or even of how many concurrent tests you are running.

### Contents

- [List of features](https://github.com/adrdilauro/angular-ab-tests#features)
- [Quick introduction to usage](https://github.com/adrdilauro/angular-ab-tests#usage-in-short)
- [Why this plugin is good for you](https://github.com/adrdilauro/angular-ab-tests#why-to-use-this-plugin)
- [How to set up a quick demo to play around](https://github.com/adrdilauro/angular-ab-tests#setup-a-demo)
- [Full documentation part 1: Initializing](https://github.com/adrdilauro/angular-ab-tests#documentation-1-initializing)
- [Full documentation part 2: Usage](https://github.com/adrdilauro/angular-ab-tests#documentation-2-usage)
- [Full documentation part 3: Tips](https://github.com/adrdilauro/angular-ab-tests#documentation-3-tips)


# Features

- Set up an A/B test with a **simple and descriptive code** (the module makes available just one simple structural directive)
- A/B tests are valid across different pages, using cookies with the expiration you want
- Test **multiple versions** with changes as complicated as you need, while still keeping the code clean and understandable
- Effortlessly set up **any number of independent A/B tests**, being sure that they won't clash in the code
- Select a special version for crawlers, so you won't affect your SEO while you are running the test


# Usage in short

Add it to the list of dependencies using npm: [link to npm repo]

```
npm install xxx # TODO
```

Setup an A/B test including the module with `forRoot` method:

```typescript
@NgModule({
  imports: [
    AbTestsModule.forRoot([
      {
        {
          versions: [ 'old', 'new' ],
          versionForCrawlers: 'old',
          expiration: 45,
        },
      }
    ]),
  ],
  exports: [
    AbTestsModule,
  ],
})
```

Wrap fragments of HTML inside the structural directive named `abTestVersions`, marking them to belong to one or more of the versions of your A/B test.

```html
<ng-container *abTestVersion="'old'">
  Old version goes here
</ng-container>

<ng-container *abTestVersion="'new'">
  New version goes here
</ng-container>
```


# Why to use this plugin


You can create several different versions, as complex and as big as you need, without filling your HTML with unnecessary code. This will make your A/B test less error prone, and also it will make it easier to remove the loser versions after the test, because the code is clear and descriptive.

Versions that are not selected are automatically removed from change detection at initialization, so no performance issues.

You can easily span your tests across different pages reading the same cookie, with no additional code.

You can maintain as many different A/B tests you want without risking them to clash in the code.

### What about simple A/B tests? Why should I use this plugin for a simple test as well?

Usually, to set up a small A/B test (changing a color, removing or adding a div, etc) people use client side tools like Google Optimize.

This approach can potentially affect user experience, because Google Optimize has to change parts of the page depending on the specific version selected, and, if this happens while the user is already looking at the page, we have the effect called "page flickering". To prevent page flickering Google Optimize introduced a "hide-page tag", i.e. a script that hides the page until the external call to Google Optimize server has responded.

Now, usually Google Optimize tag loads fast, but you cannot always rely on external calls, especially in conditions of low network; in the worst scenario, if Google Optimize server doesn't respond, the hide-page tag gets unblocked after the threshold of 4 seconds.

This means that, even if your server has responded in 150 milliseconds, your user won't be able to see anything in the page until the 4 seconds have expired.

Are you sure you want to risk this? With AngularAbTests you can set up a simple A/B test easily and cleanly directly in the code, this means that you can get rid of the hide-page tag, and let Google Optimize focus only on data collection.


# Setup a demo

suggerisci how to play around


# Documentation 1: Initializing

metti prima forRoot e directive structural (con link a angular guide)
usage metti link below anchor
poi spiega il mio modo ideale con link a demo e anche codice lì


# Documentation 2: Usage

tutti I casi
metti link a chrome cookie tool


# Documentation 3: Tips
