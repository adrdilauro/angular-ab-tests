AngularAbTests is an [angular](https://angular.io/) module that helps you setting up **easily** and **clearly** any AB or multivariate test.

It will **make your tests easy to debug and understand**, regardless of how complex they are, of how many versions you are setting up, or even of how many concurrent tests you are running.

### Contents

- [List of features](https://github.com/adrdilauro/angular-ab-tests#features)
- [Quick introduction to usage](https://github.com/adrdilauro/angular-ab-tests#usage-in-short)
- [Why this plugin is good for you](https://github.com/adrdilauro/angular-ab-tests#why-to-use-this-plugin)
- [How to set up a quick demo to play around](https://github.com/adrdilauro/angular-ab-tests#set-up-a-demo)
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

Add it to the list of dependencies using npm: [link to npm repo] TODO

```
npm install xxx # TODO
```

Set up an A/B test including the module with `forRoot` method:

```javascript
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

### What about simple A/B tests? Why should I use AngularAbTests for a simple test as well?

Usually, to set up a small A/B test (changing a color, removing or adding a div, etc) people use client side tools like Google Optimize.

This approach can potentially affect user experience, because Google Optimize has to change parts of the page depending on the specific version selected, and, if this happens while the user is already looking at the page, we have the effect called "page flickering". To prevent page flickering Google Optimize introduced a "hide-page tag", i.e. a script that hides the page until the external call to Google Optimize server has responded.

Now, usually Google Optimize tag loads fast, but you cannot always rely on external calls, especially in conditions of low network; in the worst scenario, if Google Optimize server doesn't respond, the hide-page tag gets unblocked after the threshold of 4 seconds.

This means that, even if your server has responded in 150 milliseconds, your user won't be able to see anything in the page until the 4 seconds have expired.

Are you sure you want to risk this? With AngularAbTests you can set up a simple A/B test easily and cleanly directly in the code, this means that you can get rid of the hide-page tag, and let Google Optimize focus only on data collection.


# Set up a demo

You can setup a simple demo to play around with the plugin and see how it works: the demo is in the same repository, in the folder `/demo`.

1. `git clone git@github.com:adrdilauro/angular-ab-tests.git`
2. Navigate to the folder `/demo`
3. `npm install`
4. `ng test` if you want to run the Karma specs
5. `ng serve`

The demo contains a simple A/B test serving two different components depending on the chosen version. You can play around, add more tests / versions, and explore all the configuration options.


# Documentation 1: Initializing

AngularAbTests declares just one directive called `*abTestVersion`. The directive is structural and it's used to wrap parts of the HTML that you want to A/B test.

In order to use this directive, you need to import the module `AbTestsModule` wherever you need it.

Besides importing the module, the other thing you need to do is initialize the global service the directive reads from: this service is used to store all the running A/B tests, and when it's called by the directive it returns the appropriate test with the version that is currently chosen.

The service needs to be **global**, so it needs to be initialized at root level: for this reason, AngularAbTests provides a `forRoot` method to be used at the root of your application:

```javascript
@NgModule({
  imports: [
    AbTestsModule.forRoot([
      {
        // Configuration for the first test
      },
      {
        // Configuration for the second test
      },
      // etc
    ]),
  ],
})
export class AppModule {}
```

I'll soon explain in detail (see [Documentation 2: Usage](https://github.com/adrdilauro/angular-ab-tests#documentation-2-usage)) both the usage of the directive and the options available in each configuration object. Before coming to that, I want to give some practical tips about the set up process.

### Best practice for setting up AngularAbTests

The best way to set up AngularAbTests is to include the `forRoot` call in your `CoreModule`, this is called the "forRoot pattern" (see [Angular's official documentation](https://angular.io/guide/ngmodule#configure-core-services-with-coremoduleforroot) for details: in a nutshell, when you need a service to be global under all circumstances, you cannot risk it to be included in modules that are lazy loaded, otherwise the lazy loaded module will be provided of a copy of the original service).

So, if you follow the Angular best practice and have your own `CoreModule`, that's the best place to configure AngularAbTests:

```javascript
@NgModule({
  imports: [
    SomeModuleWithProviders,
    AnotherModuleWithProviders,
    AbTestsModule.forRoot([
      {
        // Configuration for the first test
      },
      {
        // Configuration for the second test
      },
      // etc
    ]),
  ],
})
export class CoreModule {
  // Content of the CoreModule, usually a guard against double loading
}
```

If you are setting up a lot of tests, you might want to clean up your `CoreModule` and extract the AngularAbTests logic into a separate one. Create a separate file called `tests.module.ts`:

```javascript
import { NgModule } from '@angular/core';
import { AbTestsModule, AbTestOptions } from 'angular-ab-tests/angular-ab-tests.module'; // TODO

export const abTestsOptions: AbTestOptions[] = [
  {
    // Configuration for the first test
  },
  {
    // Configuration for the second test
  },
  // etc
];

@NgModule({
  imports: [
    AbTestsModule.forRoot(abTestsOptions),
  ],
})
export class TestsModule {}
```

In order to clean up better your module, you can declare the configuration options separately as a constant of type `AbTestOptions[]`: type `AbTestOptions` is imported from `angular-ab-tests/angular-ab-tests.module`. Again, for a detailed description of configuration options, see [the second part of the documentation](https://github.com/adrdilauro/angular-ab-tests#documentation-2-usage).

To complete your refactoring, you then import your `TestsModule` into `CoreModule`:

```javascript



```






poi scrivi shared module

infine metti link a lista di moduli tipici da angular.io



metti prima forRoot e directive structural (con link a angular guide)
usage metti link below anchor
poi spiega il mio modo ideale con link a demo e anche codice lì


# Documentation 2: Usage

tutti I casi
metti link a chrome cookie tool


# Documentation 3: Tips
